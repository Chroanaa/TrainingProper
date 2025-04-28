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

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleGetSemester = (e) => {
    setSemester(e.target.value);
  };
  const handleGetSchedule = async () => {
    const schedule = await getSchedule(semester);
    const data = Object.keys(schedule).map((key) => {
      const values = Object.values(schedule[key]);
      setSchedule(values);
    });
  };
  const renderSchedule = (schedule) => {
    if (schedule.length === 0) return null;
    const times = schedule[2] || [];
    const events = schedule[0] || [];
    let scheduleHtml = "<h2>Schedules:</h2>";
    for (let i = 0; i < Math.max(times.length, events.length); i++) {
      const time = times[i] || "No Time Available";
      const event = events[i] || "No Event Available";
      scheduleHtml += `<p>${time}: ${event}</p>`;
    }
    quillRef.current?.setHtml(scheduleHtml);
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
        {renderSchedule(schedule)}
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
