import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import QuillComponent from "./Quill";
import { Button } from "@mui/material";
import { insert } from "../../firebase/createPOI";
import { generateId } from "../utils/generateId";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import { useNavigate } from "react-router";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { getSchedule } from "../../firebase/getSchedule";

function UploadMaterialPanel({ value, index }) {
  const navigate = useNavigate();
  const quillRef = React.useRef(null);

  const [title, setTitle] = React.useState("Untitled");
  const [semester, setSemester] = React.useState("");
  const [schedule, setSchedule] = React.useState([]);
  React.useEffect(() => {
    console.log(schedule);
  }, [schedule]);
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleGetSemester = (e) => {
    setSemester(e.target.value);
  };

  const handleGetSchedule = async () => {
    const data = await getSchedule(semester);

    if (!data) {
      quillRef.current?.setHtml("<h2>No Schedule Available</h2>");
      return;
    }
    const schedules = Object.values(data);
    setSchedule(schedules);
    renderSchedule(schedules);
  };
  const renderSchedule = (schedule) => {
    if (!schedule) {
      quillRef.current?.setHtml("<h2>No Schedule Available</h2>");
      return;
    }
    let scheduleHtml = "<h2>Schedule</h2>";
    console.log(schedule);
    for (let i = 0; i < schedule.length; i++) {
      const scheduleData = schedule[i];
      scheduleHtml += `
      <h3>${scheduleData.trainingDay}</h3>`;
      const times = scheduleData.time;
      const event = scheduleData.event;
      for (let j = 0; j < times.length; j++) {
        scheduleHtml += `<h4>${times[j]}: ${event[j]}</h4>`;
      }
      quillRef.current?.setHtml(scheduleHtml);
    }
  };
  const handleSave = () => {
    const content = quillRef.current?.getHtml();
    insert({
      id: generateId(),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        console.log("Document saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving document:", error);
      });
    navigate("/List");
  };
  const handleDownload = async () => {
    const quill = quillRef.current;
    const html = quill.getContents();
    const pdfBlob = await pdfExporter.generatePdf(html, {
      filename: `${title}.pdf`,
      margin: 10,
      pageSize: "A4",
      pageOrientation: "portrait",
    });
    saveAs(pdfBlob, `${title}.pdf`);
  };
  return (
    <div className=' p-4 container'>
      <CustomTabPanel value={value} index={0}>
        <input type='text' value={title} onChange={handleOnChange} />
        <FormControl fullWidth>
          <InputLabel id='semester-select-label'>Semester</InputLabel>
          <Select
            labelId='semester-select-label'
            id='semester-select'
            value={semester}
            label='Semester'
            onChange={handleGetSemester}
          >
            <MenuItem value={"1st Semester"}>1st Semester</MenuItem>
            <MenuItem value={"2nd Semester"}>2nd Semester</MenuItem>
          </Select>
        </FormControl>
        <QuillComponent ref={quillRef} />
        <div className='gap-3 rounded-lg p-4 flex justify-end'>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
          <Button variant='contained' onClick={handleGetSchedule}>
            Get Schedules
          </Button>
          <Button variant='contained' onClick={handleDownload}>
            Download
          </Button>
        </div>
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
