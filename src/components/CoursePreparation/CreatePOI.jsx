import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import QuillComponent from "../ui/Quill";
import { Button } from "@mui/material";
import { insert } from "../../../firebase/POI/createPOI";
import { generateId } from "../../utils/generateId";
import { useNavigate } from "react-router";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { getSchedule } from "../../../firebase/Schedule/getSchedule";
import ConfirmDialog from "../ui/ConfirmDialog";
import { saveToLocalStorage } from "../../utils/saveToLocalStorage";
import html2pdf from "html2pdf.js";
import AddTableModal from "../AddTableModal";

function UploadMaterialPanel({ value, index }) {
  const navigate = useNavigate();
  const quillRef = React.useRef(null);

  const [title, setTitle] = React.useState("Untitled");
  const [semester, setSemester] = React.useState("");
  const [schedule, setSchedule] = React.useState([]);
  const [quillContent, setQuillContent] = React.useState("");
  const [openAddTableModal, setOpenAddTableModal] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState({
    isOpen: false,
    dialog: "",
  });

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleGetSemester = (e) => {
    setSemester(e.target.value);
    setDisabled(false);
  };
  quillRef.current?.onChange((html) => {
    setQuillContent(html);
    saveToLocalStorage("poiQuill", html);
  });
  React.useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem("poiQuill"));
    if (savedContent) {
      quillRef.current?.setHtml(savedContent);
    }
  }, []);
  React.useEffect(() => {
    if (value == 0) {
      const savedContent = JSON.parse(localStorage.getItem("poiQuill"));
      if (savedContent) {
        quillRef.current?.setHtml(savedContent);
      }
    }
  }, [value]);
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const handleBeforeUnload = (event) => {
    event.preventDefault();
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
  const renderDialog = () => {
    if (openConfirmDialog.dialog === "save") {
      return (
        <ConfirmDialog
          open={openConfirmDialog.isOpen}
          onClose={() => setOpenConfirmDialog({ isOpen: false })}
          title='Save Document'
          message='Are you sure you want to save this document?'
          onConfirm={() => {
            handleSave();
            setOpenConfirmDialog({ isOpen: false });
          }}
        />
      );
    } else if (openConfirmDialog.dialog === "download") {
      return (
        <ConfirmDialog
          open={openConfirmDialog.isOpen}
          onClose={() => setOpenConfirmDialog({ isOpen: false })}
          title='Download Document'
          message='Are you sure you want to download this document?'
          onConfirm={() => {
            handleDownload();
            setOpenConfirmDialog({ isOpen: false });
          }}
        />
      );
    } else if (openConfirmDialog.dialog === "getSchedule") {
      return (
        <ConfirmDialog
          open={openConfirmDialog.isOpen}
          onClose={() => setOpenConfirmDialog({ isOpen: false })}
          title='Get Schedule'
          message='Are you sure you want to get the schedule?'
          onConfirm={() => {
            handleGetSchedule();
            setOpenConfirmDialog({ isOpen: false });
          }}
        />
      );
    }
  };
  return (
    <div className=' p-4 container'>
      <CustomTabPanel value={value} index={0}>
        <div className="flex justify-between gap-4 mb-3">
        <input type='text' value={title} className=" " onChange={handleOnChange} />
        <div className='gap-3 rounded-lg flex justify-end'>
        <Button
  sx={{ 
    backgroundColor: '#556B2F',
    '&:hover': {
      backgroundColor: '#4A5D29'
    }
  }}
  variant='contained'
  onClick={() =>
    setOpenConfirmDialog({
      isOpen: true,
      dialog: "save",
    })
  }
>
  Save
</Button>


          <Button
           sx={{ 
            backgroundColor: '#2c2c2c',
            '&:hover': {
              backgroundColor: '#4A5D29'
            }
          }}
            variant='contained'
            onClick={() =>
              setOpenConfirmDialog({
                isOpen: true,
                dialog: "getSchedule",
              })
            }
            disabled={disabled}
          >
            Get Schedules
          </Button>

          <Button
                     sx={{ 
                      backgroundColor: '#2c2c2c',
                      '&:hover': {
                        backgroundColor: '#4A5D29'
                      }
                    }}
            variant='contained'
            onClick={() =>
              setOpenConfirmDialog({
                isOpen: true,
                dialog: "download",
              })
            }
          >
            Download
          </Button>
          <Button
                     sx={{ 
                      backgroundColor: '#2c2c2c',
                      '&:hover': {
                        backgroundColor: '#4A5D29'
                      }
                    }}
            variant='contained'
            onClick={() => setOpenAddTableModal(true)}
          >
            Add Table
          </Button>
          </div>

        </div>
        <AddTableModal
          open={openAddTableModal}
          onClose={() => setOpenAddTableModal(false)}
          tableModule={quillRef.current?.getTable()}
        />
        <div className="mb-3">
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
        </div>
        <QuillComponent ref={quillRef} />
        

        {renderDialog()}
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
