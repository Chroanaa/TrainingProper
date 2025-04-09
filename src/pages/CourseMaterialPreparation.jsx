import React from "react";
import CoursePrepTabs from "../components/CoursePrepTabs";
import UploadMaterialPanel from "../components/UploadMaterialPanel";
import SetSchedulePanel from "../components/SetSchedulePanel";
import ViewSchedulePanel from "../components/ViewSchedulePanel";
import { getSchedules } from "../../firebase/getSchedules";
import { useLoaderData } from "react-router-dom";

function CourseMaterialPreparation() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <h1 className='text-[2rem] ml-[1rem]'>Course Material Preparation</h1>
      <div className='flex flex-col  w-full'>
        <div className='flex flex-col justify-center items-center mt-10'>
          <CoursePrepTabs value={value} handleChange={handleChange} />
          <UploadMaterialPanel value={value} index={0} />
          <SetSchedulePanel value={value} index={1} />
          <ViewSchedulePanel value={value} index={2} />
        </div>
      </div>
    </div>
  );
}

export default CourseMaterialPreparation;
