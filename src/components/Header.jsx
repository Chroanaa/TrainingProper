import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../assets/images/logo.png";

function Header() {
  const currentLink = ({ isActive }) => {
    return {
      color: isActive ? "#FFD700" : "white",
    };
  };
  return (
    <div className='flex flex-col justify-start items-start bg-[#4B5320] h-screen w-[20%] p-2'>
      <div className=' mb-5'>
        <img src={Logo} alt='' />
        <p className='text-center text-[#FFD700] font-bold'>
          QUEZON CITY UNIVERSITY
        </p>
        <p className='text-center text-white text-[0.7rem]'>
          Reserve Officer’s Training Corps
        </p>
      </div>

      <div className='mt-5 flex flex-col gap-1'>
        <NavLink
          to='CourseMaterialPrep'
          className='text-[0.7rem] text-white hover:text-[#FFD700]'
          style={currentLink}
        >
          COURSE MATERIAL PREPARATION
        </NavLink>

        <NavLink
          className='text-[0.7rem] text-white hover:text-[#FFD700]'
          style={currentLink}
          to={"/List"}
        >
          TRAINING PROGRAM
        </NavLink>
        <NavLink
          to={"/TrainingReport"}
          style={currentLink}
          className='text-[0.7rem] text-white hover:text-[#FFD700]'
        >
          TRAINING REPORT
        </NavLink>
        <NavLink
          to='Create'
          className='text-[0.7rem] text-white hover:text-[#FFD700]'
          style={currentLink}
        >
          REPORT CREATION
        </NavLink>
        <NavLink
          className='text-[0.7rem] text-white hover:text-[#FFD700]'
          style={currentLink}
          to={"IncidentReport"}
        >
          INCIDENT REPORT{" "}
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
