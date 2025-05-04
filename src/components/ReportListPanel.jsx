import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import AccordionExpand from "./ui/AccordionExpand";
import { Button } from "@mui/material";
import { deleteReport } from "../../firebase/deleteReport";
import { Box, Modal } from "@mui/material";
import { getReport } from "../../firebase/getReport";
import { updateReport } from "../../firebase/updateReport";
import DeleteDialog from "./ui/DeleteDialog";
import { set } from "firebase/database";
function ReportListPanel({ value, reports }) {
  const [report, setReport] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleDeleteOpen = () => setDeleteOpen(!deleteOpen);
  const openEditModal = async (reportId) => {
    console.log(reportId);
    const reportData = await getReport(reportId);
    setReport(reportData);
  };
  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId);
      console.log("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };
  const handleUpdateReport = async () => {
    try {
      await updateReport(report.id, report);
      console.log("Report updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <h2 className='text-[1.5rem]'>Report List</h2>
        <p>Here is the list of reports.</p>
        <div className='flex flex-col gap-2'>
          {reports.map((report, index) => (
            <div key={index}>
              <AccordionExpand
                key={index}
                title={report.title}
                content={report.description}
                id={index}
              />
              <Button
                variant='contained'
                onClick={() => {
                  openEditModal(report.id);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              <Button variant='contained' onClick={() => handleDeleteOpen()}>
                Delete
              </Button>
              <DeleteDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onDelete={() => {
                  handleDeleteReport(report.id);
                  setDeleteOpen(false);
                }}
                title={"Delete Report"}
                item={"report"}
              />
            </div>
          ))}
        </div>
      </CustomTabPanel>
      <Modal open={open} onClose={handleOpen}>
        <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] bg-white border-2 border-black shadow-xl p-4'>
          <h2 className='text-[1.5rem]'>Edit Report</h2>
          <p>Title:</p>
          <input
            type='text'
            value={report.title}
            onChange={(e) => setReport({ ...report, title: e.target.value })}
          ></input>
          <p>Description:</p>
          <textarea
            type='text'
            value={report.description}
            onChange={(e) =>
              setReport({ ...report, description: e.target.value })
            }
          ></textarea>
          <p>Date:</p>
          <input
            type='date'
            value={report.date}
            onChange={(e) => setReport({ ...report, date: e.target.value })}
          ></input>
          <Button variant='contained' onClick={() => handleUpdateReport()}>
            Save
          </Button>
          <Button variant='contained' onClick={handleOpen}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ReportListPanel;
