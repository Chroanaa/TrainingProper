import React from "react";
import CoursePrepTabs from "../components/CoursePrepTabs";
import UploadMaterialPanel from "../components/UploadMaterialPanel";
import SetSchedulePanel from "../components/SetSchedulePanel";
import ViewSchedulePanel from "../components/ViewSchedulePanel";
import { getSchedules } from "../../firebase/getSchedules";
import { useSearchParams } from "react-router-dom";

function CourseMaterialPreparation() {
  const params = new URLSearchParams(window.location.search);
  const [searchParams, setSearchParams] = useSearchParams();
  const list = params.get("list");
  const [schedules, setSchedules] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = getSchedules((data) => {
      setSchedules(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (list === "view") {
      setValue(2);
    }
    setTimeout(() => {
      searchParams.delete("list");
      setSearchParams(searchParams);
    }, 200);
  }, [list]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="grow  ">
      <h1 className='text-[2rem] ml-[1rem]'>Course Material Preparation</h1>
      <div className='flex flex-col  w-full'>
        <div className='flex flex-col justify-center items-center mt-10l'>
          <CoursePrepTabs value={value} handleChange={handleChange} />
          <UploadMaterialPanel value={value} index={0} />
          <SetSchedulePanel value={value} index={1} />
          <ViewSchedulePanel value={value} index={2} schedules={schedules} />
        </div>
      </div>
    </div>
  );
}

export default CourseMaterialPreparation;
