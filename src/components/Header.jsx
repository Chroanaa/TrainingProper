import React from "react";
import { NavLink, Outlet } from "react-router";
import Navigation from "./Navigation";

function Header() {
  return (
    <div className="flex">
      <Navigation />
      <div className="border-2 border-gray-300 bg-white w-full h-screen p-5">
           <NavLink to='/SendDocument' className='text-2xl font-bold text-red-500'>
                    Send Syllabus
             </NavLink>
             <NavLink to='/Create' className='text-2xl font-bold text-blue-500'>
                  Create Training
              </NavLink>
             <NavLink to='/List' className='text-2xl font-bold text-blue-500'>
                  Training List
              </NavLink>
      </div>
    </div>
  );
}

export default Header;
