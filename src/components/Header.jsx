import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../assets/images/logo.png";

function Header() {
  return (
     <div className="flex flex-col justify-start items-start bg-[#4B5320] h-screen w-[20%] p-2">
               <div className=" mb-5">
                   <img src={Logo} alt="" />
                   <p className="text-center text-[#FFD700] font-bold">QUEZON CITY UNIVERSITY</p>
                   <p className="text-center text-white text-[0.7rem]">Reserve Officer’s Training Corps</p>
               </div>
   
               <div className="mt-5 flex flex-col gap-1">
                   <NavLink  className="text-[0.7rem] text-white">COURSE MATERIAL PREPARATION</NavLink>
                   <NavLink className="text-[0.7rem] text-white">EVENT DEPLOYMENT REVIEW</NavLink>
                   <NavLink className="text-[0.7rem] text-white">TRAINING PROGRAM</NavLink>
                   <NavLink className="text-[0.7rem] text-white">TRAINING REPORT</NavLink>
                   <NavLink className="text-[0.7rem] text-white">REPORT CREATION</NavLink>
                   <NavLink className="text-[0.7rem] text-white">INCIDENT REPORT    </NavLink>
                   <NavLink className="text-[0.7rem] text-white">ATTENDANCE REPORT</NavLink>
               </div>
           </div>
  );
}

export default Header;
