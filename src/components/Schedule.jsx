import React from "react";
import { Button, FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

function Schedule({
  handleScheduleChange,
  scheduleTime,
  handleSave,
  semester,
  schoolYear,
  handleSchoolYearChange,
  handleSemesterChange,
}) {
  const currentYear = new Date().getFullYear();
  const schoolYears = Array.from({ length: 4 }, (_, i) => {
    const startYear = currentYear - 3 + i;
    return `${startYear}-${startYear + 1}`;
  });
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-outlined-label'>
          Select School Year
        </InputLabel>
        <Select
          className='w-[200px]'
          value={schoolYear || ""}
          label='Select Semester'
          onChange={(event) => handleSchoolYearChange(event.target.value)}
        >
          {schoolYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-outlined-label'>
          Select Semester
        </InputLabel>
        <Select
          className='w-[200px]'
          value={semester || ""}
          label='Select Semester'
          onChange={(event) => handleSemesterChange(event.target.value)}
        >
          <MenuItem value={"1st Semester"}>1st Semester</MenuItem>
          <MenuItem value={"2nd Semester"}>2nd Semester</MenuItem>
        </Select>
      </FormControl>

      <ul className='flex flex-col gap-2'>
        {scheduleTime.map((item, index) => (
          <li key={index} className='flex gap-2'>
            <span>{item.time}</span>
            <input
              type='text'
              value={item.event}
              className='border border-gray-300 rounded p-2'
              onChange={(event) => handleScheduleChange(index, event)}
            />
          </li>
        ))}
      </ul>
      <Button variant='contained' onClick={() => handleSave()}>
        Save Schedule
      </Button>
    </div>
  );
}

export default Schedule;
