import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Collapse,
  ListItemButton,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { deleteSchedule } from "../../../firebase/Schedule/deleteSchedule";
import { getSchedule } from "../../../firebase/Schedule/getSchedule";
import { saveSchedule } from "../../../firebase/Schedule/saveSchedule";
import DeleteDialog from "../ui/DeleteDialog";
import ConfirmDialog from "../ui/ConfirmDialog";

function ViewSchedulePanel({ value, schedules }) {
  const [openItems, setOpenItems] = React.useState({});
  const [schedule, setSchedule] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const handleClick = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleScheduleChange = (index, event) => {
    const newSchedule = [...schedule];
    newSchedule[index].event = event.target.value;
    setSchedule(newSchedule);
  };

  const handleDelete = async (trainingDay, semester) => {
    await deleteSchedule(trainingDay, semester);
  };

  const getSchedules = async (semester, trainingDay) => {
    const data = await getSchedule(semester, trainingDay);
    const { event, time } = data;
    const scheduleData = time.map((time, index) => ({
      time: time,
      event: event[index],
      semester: semester,
      trainingDay: trainingDay,
    }));
    setSchedule(scheduleData);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSave = async () => {
    const scheduleData = {
      trainingDay: schedule[0].trainingDay,
      semester: schedule[0].semester,
      time: schedule.map((item) => item.time),
      event: schedule.map((item) => item.event),
    };
    await saveSchedule(scheduleData);
    setOpen(false);
  };

  return (
    <div className='w-full'>
      <CustomTabPanel value={value} index={2}>
        <List
          sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}
          component='nav'
          subheader={
            <ListSubheader component='div'>ROTC Schedules</ListSubheader>
          }
        >
          {schedules.map((schedule, index) => (
            <div key={index} className='border-b py-2'>
              <ListItemButton onClick={() => handleClick(index)}>
                <ListItemText
                  primary={
                    <span className='font-semibold text-[#4B5320]'>
                      {schedule.trainingDay} - {schedule.semester}
                    </span>
                  }
                />
              </ListItemButton>
              <Collapse in={!!openItems[index]} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {schedule.time.map((time, timeIndex) => (
                    <ListItem key={timeIndex}>
                      <ListItemText
                        primary={`${time} - ${schedule.event[timeIndex]}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <div className='flex gap-2 px-4 pt-2'>
                <Button
                  variant='outlined'
                  color='error'
                  size='small'
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  onClick={() => {
                    handleOpen();
                    getSchedules(schedule.trainingDay, schedule.semester);
                  }}
                >
                  Edit
                </Button>
              </div>
              <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onDelete={() => {
                  handleDelete(schedule.trainingDay, schedule.semester);
                  setOpenDeleteDialog(false);
                }}
                title={`Delete ${schedule.trainingDay} - ${schedule.semester}`}
                item={schedule.trainingDay}
              />
            </div>
          ))}
        </List>
      </CustomTabPanel>

      <Modal open={open} onClose={handleOpen}>
  <Box
    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[700px] bg-white rounded-lg shadow-2xl p-6 overflow-y-auto'
    sx={{
      maxHeight: "90vh", // this enables scroll when content overflows
    }}
  >
    <Typography variant='h5' gutterBottom>
      Edit Schedule
    </Typography>
    <Typography variant='body2' className='mb-4'>
      Set your course schedule here.
    </Typography>
    <div className='space-y-4'>
      {schedule.map((item, index) => (
        <div key={index} className='flex flex-col'>
          <span className='text-sm text-gray-600 font-medium mb-1'>
            {item.time}
          </span>
          <textarea
            value={item.event}
            onChange={(event) => handleScheduleChange(index, event)}
            className='border border-gray-300 rounded-md p-2 resize-none w-full text-sm'
          />
        </div>
      ))}
      <div className='pt-4 flex justify-end gap-2'>
        <Button variant='contained' onClick={() => setOpenConfirmDialog(true)}>
          Save
        </Button>
        <Button variant='outlined' onClick={handleOpen}>
          Cancel
        </Button>
      </div>
    </div>
    <ConfirmDialog
      open={openConfirmDialog}
      onClose={() => setOpenConfirmDialog(false)}
      onConfirm={() => {
        handleSave();
        setOpenConfirmDialog(false);
      }}
      title='Confirm Save'
      message='Are you sure you want to save this schedule?'
    />
  </Box>
</Modal>

    </div>
  );
}

export default ViewSchedulePanel;
