import React from "react";
import { Box, Tabs, Tab, Button, FormControl, InputLabel } from "@mui/material";
import CustomTabPanel from "../components/CustomTabPanel";
import Schedule from "../components/Schedule";
import { saveSchedule } from "../../firebase/saveSchedule";
import { useNavigate } from "react-router";
import Alert from "@mui/material/Alert";
function allyProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

function CourseMaterialPreparation() {
  const scheduleTime = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
  ];
  const [show, setShow] = React.useState("hidden");
  const [value, setValue] = React.useState(0);
  const [schedule, setSchedule] = React.useState(
    scheduleTime.map((time) => ({
      time: time,
      event: "",
    }))
  );
  const navigate = useNavigate();
  const [semester, setSemester] = React.useState();
  const [schoolYear, setSchoolYear] = React.useState();
  React.useEffect(() => {
    console.log("Updated semester:", semester);
  }, [semester]);

  React.useEffect(() => {
    console.log("Updated schoolYear:", schoolYear);
  }, [schoolYear]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleScheduleChange = (index, event) => {
    const newSchedule = [...schedule];
    newSchedule[index].event = event.target.value;
    setSchedule(newSchedule);
  };
  const handleSemesterChange = (value) => {
    setSemester(value);
    console.log(semester);
  };
  const handleSchoolYearChange = (value) => {
    setSchoolYear(value);
    console.log(schoolYear);
  };
  const handleSave = async () => {
    const scheduleData = {
      id: `${schoolYear}-${semester}`,
      schoolYear: schoolYear,
      semester: semester,
      time: schedule.map((item) => item.time),
      event: schedule.map((item) => item.event),
    };
    await saveSchedule(scheduleData);
    console.log("Schedule saved:", scheduleData);
    setShow("");
    setValue(2);
  };
  return (
    <div>
      <h1 className='text-[2rem] ml-[1rem]'>Course Material Preparation</h1>
      <div className='flex flex-col  w-full'>
        <div className='flex flex-col justify-center items-center mt-10'>
          <Box>
            <Tabs
              value={value}
              variant='scrollable'
              scrollButtons='auto'
              allowScrollButtonsMobile
              onChange={handleChange}
            >
              <Tab label='Upload Material' {...allyProps(0)} />
              <Tab label='Set Schedule' {...allyProps(1)} />
              <Tab label='View Schedules' {...allyProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <h2 className='text-[1.5rem]'>Upload Material</h2>
            <p>Upload your course material here.</p>
            <input type='file' />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <h2 className='text-[1.5rem]'>Set Schedule</h2>
            <p>Set your course schedule here.</p>
            <Schedule
              scheduleTime={schedule}
              handleScheduleChange={handleScheduleChange}
              handleSchoolYearChange={handleSchoolYearChange}
              handleSemesterChange={handleSemesterChange}
              semester={semester}
              schoolYear={schoolYear}
              handleSave={handleSave}
            />
            {show === "" && (
              <Alert
                className='w-[300px]'
                severity='success'
                onClose={() => {
                  setShow("hidden");
                  setValue(2);
                }}
              >
                Schedule saved successfully!
              </Alert>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <h2 className='text-[1.5rem]'>View Schedules</h2>
            <p>View your course schedules here.</p>
            <ul>
              <li>Schedule 1: Date - Time</li>
              <li>Schedule 2: Date - Time</li>
            </ul>
          </CustomTabPanel>
        </div>
      </div>
    </div>
  );
}

export default CourseMaterialPreparation;
