import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import AccordionExpand from "../ui/AccordionExpand";
import { Button, Box, Modal, TextField, Typography, Paper, Grid, IconButton } from "@mui/material";
import { deleteReport } from "../../../firebase/Report/deleteReport";
import { getReport } from "../../../firebase/Report/getReport";
import { updateReport } from "../../../firebase/Report/updateReport";
import DeleteDialog from "../ui/DeleteDialog";
import ConfirmDialog from "../ui/ConfirmDialog";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

function ReportListPanel({ value, reports }) {
  const [report, setReport] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setopenDeleteDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [selectedReportId, setSelectedReportId] = React.useState(null);

  const handleOpen = () => setOpen(!open);
  
  const handleopenDeleteDialog = (reportId) => {
    setSelectedReportId(reportId);
    setopenDeleteDialog(true);
  };
  
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
        <Typography variant="h4" component="h2" gutterBottom>
          Report List
        </Typography>
        <Typography variant="body1" paragraph>
          Here is the list of reports.
        </Typography>
        
        <div className="flex flex-col gap-4">
          {reports.map((report, index) => (
            <Paper 
              key={index} 
              elevation={2} 
              className="p-4 rounded-lg"
            >
              <AccordionExpand
                key={index}
                title={report.title}
                content={report.description}
                id={index}
              />
              <div className="flex gap-3 mt-4">
                <Button 
                   sx={{ 
                    backgroundColor: '#556B2F',
                    '&:hover': {
                      backgroundColor: '#4A5D29'
                    }
                  }}
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    openEditModal(report.id);
                    setOpen(true);
                  }}
                  size="medium"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleopenDeleteDialog(report.id)}
                  size="medium"
                >
                  Delete
                </Button>
              </div>
              
              <DeleteDialog
                open={openDeleteDialog && selectedReportId === report.id}
                onClose={() => setopenDeleteDialog(false)}
                onDelete={() => {
                  handleDeleteReport(selectedReportId);
                  setopenDeleteDialog(false);
                }}
                title={"Delete Report"}
                item={"report"}
              />
            </Paper>
          ))}
        </div>
      </CustomTabPanel>
      
      <Modal 
        open={open} 
        onClose={handleOpen}
        aria-labelledby="edit-report-modal"
        aria-describedby="modal-to-edit-report-details"
      >
        <Paper 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg shadow-xl"
          sx={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" component="h2" id="edit-report-modal">
              Edit Report
            </Typography>
            <IconButton onClick={handleOpen} size="small" aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="w-full space-y-4">
            <div className="w-full">
              <TextField
                label="Title"
                variant="outlined"
                value={report.title || ''}
                onChange={(e) => setReport({ ...report, title: e.target.value })}
                className="w-full"
                inputProps={{ className: "w-full" }}
              />
            </div>
            
            <div className="w-full">
              <TextField
                label="Description"
                variant="outlined"
                value={report.description || ''}
                onChange={(e) => setReport({ ...report, description: e.target.value })}
                multiline
                rows={4}
                className="w-full"
                inputProps={{ className: "w-full" }}
              />
            </div>
            
            <div className="w-full">
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                value={report.date || ''}
                onChange={(e) => setReport({ ...report, date: e.target.value })}
                className="w-full"
                inputProps={{ className: "w-full" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6 w-full">
              <Button 
                variant="outlined" 
                onClick={handleOpen}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={() => setOpenConfirmDialog(true)}
              >
                Save
              </Button>
            </div>
          </div>
          
          <ConfirmDialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            onConfirm={() => {
              handleUpdateReport();
              setOpenConfirmDialog(false);
            }}
            title="Confirm Save"
            message="Are you sure you want to save the changes?"
          />
        </Paper>
      </Modal>
    </div>
  );
}

export default ReportListPanel;