import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { viewPOI } from "../../firebase/POI/viewPOI";
import QuillComponent from "../components/ui/Quill";
import { updatePOI } from "../../firebase/POI/updatePOI";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import html2pdf from "html2pdf.js";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { getSchedule } from "../../firebase/Schedule/getSchedule";


export async function loader({ params }) {
  const { id } = params;
  const document = await viewPOI(id);
  return document;
}

function ViewPOI() {
  const { content, id, title } = useLoaderData();
  const [newTitle, setNewTitle] = React.useState(title);
  const [semester, setSemester] = React.useState("");
  const [schedule, setSchedule] = React.useState([]);
  const [disabled, setDisabled] = React.useState(true);
  const quillRef = React.useRef(null);
  const navigate = useNavigate();
  const handleBeforeUnload = (event) => {
    const confirmationMessage = "Are you sure you want to leave? Your changes may not be saved.";
    event.returnValue = confirmationMessage; // For most browsers
    return confirmationMessage; // For some older browsers
  }
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
    const handleGetSemester = (e) => {
    setSemester(e.target.value);
    setDisabled(false);
  };
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };
  React.useEffect(() => {
    if (quillRef.current) {
      quillRef.current?.setHtml(content);
    }
  }, []);
  const handleOnSave = async () => {
    const content = quillRef.current.getHtml();
    const data = {
      id: id,
      title: newTitle,
      content: content,
    };
    await updatePOI(id, data);
    navigate("/List");
  };
const handleDownload = () => {
    const quill = quillRef.current;
    const html = quill.getHtml();

    const options = {
      filename: `${newTitle}.pdf`,
      image: { type: "jpeg", quality: 0.98 }, 
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: [10, 10], orientation: "landscape" },
    };

    html2pdf().set(options).from(html).save();
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

  // Get the current length of the content
  let insertIndex = quillRef.current.quill.getLength();

  // Append "Schedule" header
  quillRef.current.quill.insertText(insertIndex, "\nSchedule", { header: 2 });
  insertIndex = quillRef.current.quill.getLength();

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
  return (
    <div>
      <div className='flex mb-2 gap-2 w-full'>
      <input  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 "  type='text' value={newTitle} onChange={handleOnChange} />
      <div className='flex items-center gap-1  w-full'>
              
        <div>
      <Button 
                 sx={{ 
                  backgroundColor: '#556b2f',
                  '&:hover': {
                    backgroundColor: '#4A5D29'
                  }
                }}
      variant='contained' onClick={handleOnSave}>
        Save
      </Button>
      </div>
      <div>
      <Button 
                 sx={{ 
                  backgroundColor: '#2c2c2c',
                  '&:hover': {
                    backgroundColor: '#4A5D29'
                  }
                }}
      variant='contained' onClick={handleDownload}>
        Download
      </Button>
      </div>
      <div>
      <Button 
                 sx={{ 
                  backgroundColor: '#2c2c2c',
                  '&:hover': {
                    backgroundColor: '#4A5D29'
                  }
                }}
      variant='contained' onClick={handleGetSchedule} disabled={disabled}>
       Get Schedules
      </Button>
      </div>
      <FormControl>
                <InputLabel id='semester-select-label'>Semester</InputLabel>
                <Select
                  className="w-50"
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
      </div>
      </div>
      <QuillComponent ref={quillRef} />
    </div>
    
  );
}

export default ViewPOI;
