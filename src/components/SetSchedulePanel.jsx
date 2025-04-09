import React from "react";
import Schedule from "../components/Schedule";
import { saveSchedule } from "../../firebase/saveSchedule";
import Alert from "@mui/material/Alert";
import CustomTabPanel from "./CustomTabPanel";
import { useSearchParams } from "react-router";
function SetSchedulePanel({ value, index }) {
  const scheduleTime = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
  ];
  const [schedule, setSchedule] = React.useState(
    scheduleTime.map((time) => ({
      time: time,
      event: "",
    }))
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(window.location.search);
  const [semester, setSemester] = React.useState();
  const [schoolYear, setSchoolYear] = React.useState();
  React.useEffect(() => {}, [semester]);

  React.useEffect(() => {}, [schoolYear]);

  const handleScheduleChange = (index, event) => {
    const newSchedule = [...schedule];
    newSchedule[index].event = event.target.value;
    setSchedule(newSchedule);
  };
  const handleSemesterChange = (value) => {
    setSemester(value);
  };
  const handleSchoolYearChange = (value) => {
    setSchoolYear(value);
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
    setSemester("");
    setSchoolYear("");
    params.set("list", "view");
    setSearchParams(params);
  };
  return (
    <div>
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
      </CustomTabPanel>
    </div>
  );
}

export default SetSchedulePanel;
