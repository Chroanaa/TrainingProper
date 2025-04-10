import React from "react";
import { Button, FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

function Schedule({
  handleScheduleChange,
  scheduleTime,
  handleSave,
  semester,
  trainingDay,
  handleChangeTrainingDay,
  handleSemesterChange,
}) {
const trainingDays = [
    '1st training day',
    '2nd training day',
    '3rd training day',
    '4th training day',
    '5th training day',
    '6th training day',
    '7th training day',
    '8th training day',
    '9th training day',
    '10th training day',
    '11th training day',
    '12th training day',
    '13th training day',
    '14th training day',
    '15th  training day'
]
  return (
    <div>
      <div className="flex justify-start align items-center gap-2 px-3 py-2">
      <FormControl >
        <InputLabel id='demo-simple-select-outlined-label'>
          Select training day
        </InputLabel>
        <Select
          className='w-[200px]'
          value={trainingDay || ""}
          label='Select Semester'
          onChange={(event) => handleChangeTrainingDay(event.target.value)}
        >

          {trainingDays.map((day, index) => (
             <MenuItem value={day} key={index}>
                {day}
              </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl >
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
</div>
      <ul className='flex flex-col gap-2 '>
        {scheduleTime.map((item, index) => (
          <li key={index} className='flex gap-2'>
            <div className="flex flex-col px-3 w-full">
            <span>{item.time}</span>
            <textarea
              type='text'
              value={item.event}
              className='border border-gray-300 rounded p-2 resize-none w-full'
              onChange={(event) => handleScheduleChange(index, event)}
            />
            </div>
          </li>
        ))}
      </ul>
      <div className="m-3">
      <Button variant='contained' onClick={() => handleSave()}>
        Save Schedule
      </Button>
      </div>
    </div>
  );
}

export default Schedule;
