import React from "react";
import { insert } from "../../firebase/ATR/createATR";
import { generateId } from "../utils/generateId";
import QuillComponent from "../components/ui/Quill";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import AlertDialog from "../components/ui/AlertDialog";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { saveToLocalStorage } from "../utils/saveToLocalStorage";
import { useDebounce } from "../hooks/useDebounce";
import Loading from "../components/ui/Loading";
import html2pdf from "html2pdf.js";
import AddTableModal from "../components/AddTableModal";
import { getAttendance } from "../../mysql/getAttendance";
import { getReportDates } from "../../firebase/Report/getReportDates";
import { getReportByDate } from "../../firebase/Report/getReportByDate";
import SelectDateDialog from "../components/ui/SelectDateDialog";
function Create() {
  const quillRef = React.useRef(null);
  const [title, setTitle] = React.useState("Untitled");
  const [openAaddTableModal, setOpenAddTableModal] = React.useState(false);
  const [reports, setReports] = React.useState([]);
  const [reportDates, setReportDates] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [openSelectDateDialog, setOpenSelectDateDialog] = React.useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = React.useState({
    isOpen: false,
    dialog: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);
  const [quillContent, setQuillContent] = React.useState("");
  const debouncedTitle = useDebounce(title, 500);

  React.useEffect(() => {
    const unsubscribe = getReportDates((data) => {
      setReportDates(data);
    });
    console.log("reportDates", reportDates);
  }, []);

  // gets the atttendance and renders it to the quill editor
  const getAttendanceData = async () => {
    try {
      setLoading(true);
      const data = await getAttendance();
      const attendanceData = Object.values(data);

      const maleAttendanceCount = attendanceData[1];
      const maleAbsenceCount = attendanceData[2];
      const femaleAttendanceCount = attendanceData[3];
      const femaleAbsenceCount = attendanceData[4];
      console.log("maleAttendanceCount", maleAttendanceCount);
      console.log("maleAbsenceCount", maleAbsenceCount);
      console.log("femaleAttendanceCount", femaleAttendanceCount);
      console.log("femaleAbsenceCount", femaleAbsenceCount);
      let insertIndex = quillRef.current.quill.getLength();
      quillRef.current?.quill.insertText(insertIndex, `\n Attendance`, {
        header: 3,
      });
      const tableModule = quillRef.current?.getTable();
      const quill = quillRef.current?.quill;
      tableModule.insertTable(4, 4);
      const table = quill.root.querySelector("table");
      const rows = table.rows;

      //actual diabolical
      rows[0].cells[0].children[0].innerHTML = "<td>Male Present</td>";
      rows[0].cells[1].children[0].innerHTML = `<td>${maleAttendanceCount}</td>`;
      rows[1].cells[0].children[0].innerHTML = "<td>Male absent</td>";
      rows[1].cells[1].children[0].innerHTML = `<td>${maleAbsenceCount}</td>`;
      rows[2].cells[0].children[0].innerHTML = "<td>Female Present</td>";
      rows[2].cells[1].children[0].innerHTML = `<td>${femaleAttendanceCount}</td>`;
      rows[3].cells[0].children[0].innerHTML = "<td Female absent</td>";
      rows[3].cells[1].children[0].innerHTML = `<td>${femaleAbsenceCount}</td>`;
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // this checks if the user is trying to leave the page and prompts them to save their work
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  quillRef.current?.onChange((html) => {
    setQuillContent(html);
    saveToLocalStorage("quillContent", html);
  });
  // gets the current content of the quill editor in case resetting the page or closing
  React.useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem("quillContent"));
    if (savedContent) {
      quillRef.current?.setHtml(savedContent);
    }
  }, []);
  React.useEffect(() => {
    if (reports && reports.length > 0) {
      console.log("Reports state updated, rendering reports");
      handleGetReports();
    }
  }, [reports]);
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
    console.log("reports", reports);
    let insertIndex = quillRef.current.quill.getLength();
    quillRef.current?.quill.insertText(insertIndex, "Reports", { header: 2 });

    for (let i = 0; i < reports.length; i++) {
      const reportData = reports[i];
      insertIndex = quillRef.current.quill.getLength();
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
        `\n Time Reported: ${new Date(reportData.date).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        { header: 5 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(insertIndex, "\n\n");
      insertIndex = quillRef.current.quill.getLength();
    }
  };

  const handleDownload = () => {
    const quill = quillRef.current;
    const html = quill.getHtml();

    const options = {
      margin: 1,
      filename: `${title}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(html).save();
  };
  const getReports = async (date) => {
    try {
      setLoading(true);
      console.log("Fetching reports for date:", date);
      const data = await getReportByDate(date);
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };
  // Dialogs for each button
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
      case "Attendance":
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
              getAttendanceData();
              setOpenConfirmDialog(true);
              setOpenConfirmDialog({
                isOpen: false,
                dialog: "",
              });
            }}
            title={"Get Attendance"}
            message={"Are you sure you want to get the attendance?"}
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
            onClick={() => setOpenSelectDateDialog(true)}
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
          <Button
            variant='contained'
            class='bg-[#2C2C2C] text-white px-5 rounded-b-sm'
            onClick={() => {
              setOpenConfirmDialog({
                isOpen: true,
                dialog: "Attendance",
              });
            }}
          >
            Get Attendance
          </Button>
          <Button
            variant='contained'
            class='bg-[#2C2C2C] text-white px-5 rounded-b-sm'
            onClick={() => {
              setOpenAddTableModal(true);
            }}
          >
            Insert Table
          </Button>
          {renderConfirmDialog()}
          <AlertDialog
            open={openAlertDialog}
            handleClose={() => setOpenAlertDialog(false)}
          />
          <Loading text={"Getting Attendance..."} show={loading} />
          <AddTableModal
            open={openAaddTableModal}
            onClose={() => setOpenAddTableModal(false)}
            tableModule={quillRef.current?.getTable()}
          />
          <SelectDateDialog
            open={openSelectDateDialog}
            onClose={() => setOpenSelectDateDialog(false)}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            onSubmit={() => {
              setOpenSelectDateDialog(false);
              getReports(selectedDate);
            }}
            selectedDate={selectedDate}
            Dates={reportDates}
          />
        </div>
      </div>
    </div>
  );
}

export default Create;
