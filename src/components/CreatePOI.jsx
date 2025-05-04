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
import ConfirmDialog from "./ui/ConfirmDialog";

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
    if (!schedule || !quillRef.current?.quill) {
      quillRef.current?.setHtml("<h2>No Schedule Available</h2>");
      return;
    }

    quillRef.current.quill.deleteText(0, quillRef.current.quill.getLength());

    quillRef.current.quill.insertText(0, "Schedule", { header: 2 });
    let insertIndex = quillRef.current.quill.getLength();

    for (let i = 0; i < schedule.length; i++) {
      const scheduleData = schedule[i];
      quillRef.current.quill.insertText(
        insertIndex,
        `\n${scheduleData.trainingDay}`,
        { header: 3 }
      );
      insertIndex = quillRef.current.quill.getLength();

      const times = scheduleData.time;
      const event = scheduleData.event;
      for (let j = 0; j < times.length; j++) {
        quillRef.current.quill.insertText(
          insertIndex,
          `\n${times[j]}: ${event[j]}`,
          { header: 4 }
        );
        insertIndex = quillRef.current.quill.getLength();
      }
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
    const quillRef1 = quillRef.current;

    if (quillRef1) {
      const delta = quillRef1.getContents();
      console.log("Using editor delta", delta);

      const pdfBlob = await pdfExporter.generatePdf(delta, {
        filename: `${title}.pdf`,
        margin: 10,
        pageSize: "A4",
        pageOrientation: "portrait",
      });
      saveAs(pdfBlob, `${title}.pdf`);
    } else {
      console.error("Quill reference is not available");
    }
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
