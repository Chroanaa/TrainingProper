import React from "react";
import { viewATR } from "../../firebase/ATR/viewATR";
import QuillComponent from "../components/ui/Quill";
import { useLoaderData } from "react-router-dom";
import { updateATR } from "../../firebase/ATR/updateATR";
import { Button } from "@mui/material";
import { html2pdf } from "html2pdf.js";
import Swal from "sweetalert2";
import AddTableModal from "../components/AddTableModal";
import { getAttendance } from "../../mysql/getAttendance";
import { getReportDates } from "../../firebase/Report/getReportDates";
import { getReportByDate } from "../../firebase/Report/getReportByDate";
import SelectDateDialog from "../components/ui/SelectDateDialog";
import Loading from "../components/ui/Loading";
export async function loader({ params }) {
  const { id } = params;
  const data = await viewATR(id);
  return data;
}

function ViewATR() {
  const data = useLoaderData();
  const [newTitle, setNewTitle] = React.useState(data.title);
  const [openAddTableModal, setOpenAddTableModal] = React.useState(false); 
  const [selectedDate, setSelectedDate] = React.useState("");
  const [reportDates, setReportDates] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [openSelectDateDialog, setOpenSelectDateDialog] = React.useState(false);
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };
  
  const quillRef = React.useRef(null);
  
  React.useEffect(() => {
    if (quillRef.current) {
      quillRef.current?.setHtml(data.content);
    }
  }, []);
    React.useEffect(() => {
      const unsubscribe = getReportDates((data) => {
        setReportDates(data);
      });
      console.log("reportDates", reportDates);
    }, []);
  
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
  const handleBeforeUnload = (event) => {
    const confirmationMessage = "Are you sure you want to leave? Your changes may not be saved.";
    event.returnValue = confirmationMessage; // For most browsers
    return confirmationMessage; // For some older browsers
  };
  
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
  
  const handleSave = async () => {
    try {
      const content = quillRef.current?.getHtml();
      const updatedData = {
        title: newTitle,
        createdAt: data.createdAt,
        content: content,
        updatedAt: new Date().toISOString(),
      };
      
      await updateATR(data.id, updatedData);
      
      // Show success message with SweetAlert
      Swal.fire({
        title: 'Saved!',
        text: 'Your ATR has been successfully saved.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50'
      });
    } catch (error) {
      // Show error message if save fails
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save your ATR. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F44336'
      });
      console.error("Error saving ATR:", error);
    }
  };
  const handleGetReports = () => {
  if (!reports || reports.length === 0) {
    quillRef.current?.quill.insertText(
      quillRef.current.quill.getLength(),
      "\nNo Reports Available",
      { header: 2 }
    );
    return;
  }

  console.log("reports", reports);
  let insertIndex = quillRef.current.quill.getLength();

  // Append "Reports" header
  quillRef.current?.quill.insertText(insertIndex, "\nReports", { header: 2 });
  insertIndex = quillRef.current.quill.getLength();

  for (let i = 0; i < reports.length; i++) {
    const reportData = reports[i];

    quillRef.current?.quill.insertText(
      insertIndex,
      `\nTitle: ${reportData.title}`,
      { header: 3 }
    );
    insertIndex = quillRef.current.quill.getLength();

    quillRef.current?.quill.insertText(
      insertIndex,
      `\nDescription: ${reportData.description}`,
      { header: 4 }
    );
    insertIndex = quillRef.current.quill.getLength();

    quillRef.current?.quill.insertText(
      insertIndex,
      `\nTime Reported: ${new Date(reportData.date).toLocaleString("en-US", {
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
        filename: `${newTitle}.pdf`,
        image: { type: "jpeg", quality: 0.98 }, 
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: [10, 10], orientation: "landscape" },
      };
  
      html2pdf().set(options).from(html).save();
  };
  React.useEffect(() => {
      if (reports && reports.length > 0) {
        console.log("Reports state updated, rendering reports");
        handleGetReports();
      }
    }, [reports]);

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
      
          const customTableHTML = `
            <table border="1" style="border-collapse: collapse; text-align: center; width: 100%;">
              <thead>
                <tr>
                  <th rowspan="2">CADET OFFICERS</th>
                  <th colspan="4">ATTENDANCE</th>
                  <th rowspan="2">TOTAL ABSENT</th>
                  <th rowspan="2">TOTAL PRESENT</th>
                </tr>
                <tr>
                  <th colspan="2">MALE</th>
                  <th colspan="2">FEMALE</th>
                </tr>
                <tr>
                  <th></th>
                  <th>P</th>
                  <th>A</th>
                  <th>P</th>
                  <th>A</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MS 42</td>
                  <td>${maleAttendanceCount}</td>
                  <td style="color:red;">${maleAbsenceCount}</td>
                  <td>${femaleAttendanceCount}</td>
                  <td style="color:red;">${femaleAbsenceCount}</td>
                  <td>${maleAbsenceCount + femaleAbsenceCount}</td>
                  <td>${maleAttendanceCount + femaleAttendanceCount}</td>
                </tr>
                <tr>
                  <td>MS 32</td>
                  <td>0</td>
                  <td style="color:red;">0</td>
                  <td>0</td>
                  <td style="color:red;">0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>MS 2</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><strong>TOTAL</strong></td>
                  <td><strong>${maleAttendanceCount}</strong></td>
                  <td><strong style="color:red;">${maleAbsenceCount}</strong></td>
                  <td><strong>${femaleAttendanceCount}</strong></td>
                  <td><strong style="color:red;">${femaleAbsenceCount}</strong></td>
                  <td><strong>${maleAbsenceCount + femaleAbsenceCount}</strong></td>
                  <td><strong>${maleAttendanceCount + femaleAttendanceCount}</strong></td>
                </tr>
              </tbody>
            </table>
          `;
      
          quillRef.current?.quill.clipboard.dangerouslyPasteHTML(insertIndex + 1, customTableHTML);
        } catch (error) {
          console.error("Error fetching attendance data:", error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
  return (
    <div>
      <div className='flex mb-2 gap-2'>
        <input 
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 " 
          type='text'
          value={newTitle} 
          onChange={handleOnChange}
          placeholder="Enter title" 
        />
        <div className='flex gap-1'>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
          <Button variant='contained' onClick={handleDownload}>
            Download as PDF
          </Button>
          <Button variant='contained' onClick={() => setOpenSelectDateDialog(true)}>
            Get Current Incident Reports
          </Button>
           <Button variant='contained'  onClick={() =>{
            getAttendanceData();
           }}> 
            Get Attendance
          </Button>
          <Button variant='contained' onClick={() => setOpenAddTableModal(true)}>
            Add Table
          </Button>
        </div>
      </div>
      <QuillComponent ref={quillRef} />
      <AddTableModal
        open={openAddTableModal}
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
              handleGetReports();
            }}
            selectedDate={selectedDate}
            Dates={reportDates}
          />
    {loading && <Loading
     show={loading}
     text={"Getting Attendance"}
    />}
    </div>
  );
}

export default ViewATR;