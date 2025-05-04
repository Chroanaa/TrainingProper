import React from "react";
import CustomTabPanel from "./CustomTabPanel";
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
} from "@mui/material";
import { deleteSchedule } from "../../firebase/deleteSchedule";
import { getSchedule } from "../../firebase/getSchedule";
import { saveSchedule } from "../../firebase/saveSchedule";
import DeleteDialog from "./ui/DeleteDialog";
import ConfirmDialog from "./ui/ConfirmDialog";
function ViewSchedulePanel({ value, schedules }) {
  const [openItems, setOpenItems] = React.useState({});
  const [schedule, setSchedule] = React.useState([]);
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

  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
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
    console.log(schedule);
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
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              ROTC Schedules
            </ListSubheader>
          }
        >
          {schedules.map((schedule, index) => (
            <div key={index}>
              <ListItemButton key={index} onClick={() => handleClick(index)}>
                <ListItemText
                  primary={`${schedule.trainingDay} - ${schedule.semester}`}
                />
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
              </ListItemButton>
              <Button onClick={() => setOpenDeleteDialog(true)}>Delete</Button>
              <Button
                onClick={() => {
                  handleOpen();
                  getSchedules(schedule.trainingDay, schedule.semester);
                }}
              >
                Edit
              </Button>
              <DeleteDialog
                open={openDeleteDialog}
                onClose={setOpenDeleteDialog}
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
        <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] bg-white border-2 border-black shadow-xl p-4'>
          <h2 className='text-[1.5rem]'>Edit Schedule</h2>
          <p>Set your course schedule here.</p>
          <div className='w-full '>
            {schedule.map((item, index) => (
              <div key={index} className='flex gap-2'>
                <div className='flex flex-col px-3 w-full'>
                  <span>{item.time}</span>
                  <textarea
                    type='text'
                    value={item.event}
                    className='border border-gray-300 rounded p-2 resize-none w-full'
                    onChange={(event) => handleScheduleChange(index, event)}
                  />
                </div>
              </div>
            ))}
            <Button onClick={() => setOpenConfirmDialog(true)}>Save</Button>
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
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ViewSchedulePanel;
