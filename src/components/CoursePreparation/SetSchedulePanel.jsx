import React from "react";
import Schedule from "../ui/Schedule";
import { saveSchedule } from "../../../firebase/Schedule/saveSchedule";
import CustomTabPanel from "../ui/CustomTabPanel";
import { useSearchParams } from "react-router";
function SetSchedulePanel({ value, index }) {
  const scheduleTime = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
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
  const [trainingDay, setTrainingDay] = React.useState();
  const handleScheduleChange = (index, event) => {
    const newSchedule = [...schedule];
    newSchedule[index].event = event.target.value;
    setSchedule(newSchedule);
  };
  const handleSemesterChange = (value) => {
    setSemester(value);
  };
  const handleChangeTrainingDay = (value) => {
    setTrainingDay(value);
  };
  const handleSave = async () => {
    const scheduleData = {
      id: `${trainingDay}-${semester}`,
      trainingDay: trainingDay,
      semester: semester,
      time: schedule.map((item) => item.time),
      event: schedule.map((item) => item.event),
    };
    await saveSchedule(scheduleData);
    setSemester("");
    setTrainingDay("");
    setSchedule(
      scheduleTime.map((time) => ({
        time: time,
        event: "",
      }))
    );

    params.set("list", "view");
    setSearchParams(params);
  };
  return (
    <div className=' w-full'>
      <CustomTabPanel value={value} index={1}>
        <div className='w-full px-3 justify-start flex-col items-center '>
          <h2 className='text-[1.5rem]'>Set Schedule</h2>
          <p>Set your course schedule here.</p>
        </div>
        <div className='w-full '>
          <Schedule
            scheduleTime={schedule}
            handleScheduleChange={handleScheduleChange}
            handleChangeTrainingDay={handleChangeTrainingDay}
            handleSemesterChange={handleSemesterChange}
            semester={semester}
            trainingDay={trainingDay}
            handleSave={handleSave}
          />
        </div>
      </CustomTabPanel>
    </div>
  );
}

export default SetSchedulePanel;
