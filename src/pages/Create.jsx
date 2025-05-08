import React from "react";
import { insert } from "../../firebase/ATR/createATR";
import { generateId } from "../utils/generateId";
import QuillComponent from "../components/ui/Quill";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import { getReports } from "../../firebase/Report/getReports";
import AlertDialog from "../components/ui/AlertDialog";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { saveToLocalStorage } from "../utils/saveToLocalStorage";
import {useDebounce} from "../hooks/useDebounce";
import { getAttendance} from "../../mysql/getAttendance"
function Create() {
  const quillRef = React.useRef(null);
  const [title, setTitle] = React.useState("Untitled");

  const [reports, setReports] = React.useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState({
    isOpen: false,
    dialog: "",
  });

  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);
  const [quillContent, setQuillContent] = React.useState("");
  const debouncedTitle = useDebounce(title, 500);
  const debouncedQuillContent = useDebounce(quillContent, 500);
  React.useEffect(() => {
    const unsubscribe = getReports((data) => {
      setReports(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const getAttendanceData = async () => {
    console.log(await getAttendance())
  }
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
 quillRef.current?.onChange((html) => {
    setQuillContent(html);
    saveToLocalStorage("quillContent", html);

  })
React.useEffect(() => {
  const savedContent = JSON.parse(localStorage.getItem("quillContent"));
  if (savedContent) {
    quillRef.current?.setHtml(savedContent);
  }
  getAttendanceData()
}, []);
  const timeCreated = new Date().toISOString();
  const handleSave = async () => {
    const html = quillRef.current?.getHtml();
    const id = generateId();
    await insert({
      id: id,
      title: debouncedTitle || "Untitled",
      content: html,
      createdAt: timeCreated,
    });
    localStorage.removeItem("quillContent");
    navigate("/TrainingReport");
  };
  const handleOnChange = (e) => {
    setTitle(e.target.value);
    
  };
  const handleGetReports = () => {
    if (!reports || reports.length === 0) {
      quillRef.current?.setHtml("<h2>No Reports Available</h2>");
      return;
    }

    quillRef.current?.quill.insertText(0, "Reports", { header: 2 });
    let insertIndex = quillRef.current.quill.getLength();

    for (let i = 0; i < reports.length; i++) {
      const reportData = reports[i];

      quillRef.current?.quill.insertText(
        insertIndex,
        `\n Title: ${reportData.title}`,
        { header: 3 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(
        insertIndex,
        `\n Description: ${reportData.description}`,
        { header: 4 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(
        insertIndex,
        `\n Time Reported: ${new Date(reportData.createdAt).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`,
        { header: 5 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(insertIndex, "\n\n");
      insertIndex = quillRef.current.quill.getLength();
    }
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
  const renderConfirmDialog = () => {
    switch (openConfirmDialog.dialog) {
      case "Save":
        return (
          <ConfirmDialog
            open={openConfirmDialog.isOpen}
            onClose={() =>
              setOpenConfirmDialog({
                isOpen: false,
                dialog: "",
              })
            }
            onConfirm={() => {
              handleSave();
              setOpenConfirmDialog({
                isOpen: false,
                dialog: "",
              });
            }}
            title={"Save Document"}
            message={"Are you sure you want to save the document?"}
          />
        );
      case "getReports":
        return (
          <ConfirmDialog
            open={openConfirmDialog.isOpen}
            onClose={() => {
                setOpenConfirmDialog({
                  isOpen: false,
                  dialog: "",
                });
            }}
            onConfirm={() => {
              handleGetReports();
              setOpenConfirmDialog({
                isOpen: false,
                dialog: "",
              });
            }}
            title={"Get Reports"}
            message={"Are you sure you want to get the reports?"}
          />
        );
      case "Download":
        return (
          <ConfirmDialog
            open={openConfirmDialog.isOpen}
            onClose={() =>
              setOpenConfirmDialog({
                isOpen: false,
                dialog: "",
              })
            }
            onConfirm={() => {
              handleDownload();
              setOpenConfirmDialog({
                isOpen: false,
                dialog: "",
              });
            }}
            title={"Download Document"}
            message={"Are you sure you want to download the document?"}
          />
        );
      default:
        return null;
    }
  };
  const handleBeforeUnload = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <h1 className='text-[2rem] mb-[1rem]'>Report Creation</h1>

      <div class='rounded p-4 shadow-md'>
        <input
          type='text'
          value={title}
          onChange={handleOnChange}
          className='border border-gray-300 rounded p-2 mb-2 w-full'
        />

        <QuillComponent content={""} ref={quillRef} />

        <div class='mt-2 gap-1 flex flex-row justify-end'>
          <Button
            variant='contained'
            class='bg-[#556B2F] text-white px-5 p-2 rounded-b-sm'
            type='submit'
            onClick={() =>
              setOpenConfirmDialog({
                isOpen: true,
                dialog: "Save",
              })
            }
          >
            Save
          </Button>
          <Button
            variant='contained'
            class='bg-[#2C2C2C] text-white px-5 p-2 rounded-b-sm'
            onClick={() =>
              setOpenConfirmDialog({
                isOpen: true,
                dialog: "getReports",
              })
            }
          >
            Get Current Incident Reports
          </Button>
          <Button
            variant='contained'
            class='bg-[#2C2C2C]  text-white px-5 rounded-b-sm'
            onClick={() =>
              setOpenConfirmDialog({
                isOpen: true,
                dialog: "Download",
              })
            }
          >
            Download
          </Button>
          {renderConfirmDialog()}
          <AlertDialog
            open={openAlertDialog}
            handleClose={() => setOpenAlertDialog(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default Create;
