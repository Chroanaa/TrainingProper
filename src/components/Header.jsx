import React from "react";
import { NavLink, Outlet } from "react-router";
function Header() {
  return (
    <div>
      <NavLink to='/SendDocument' className='text-2xl font-bold text-blue-500'>
        Send Syllabus
      </NavLink>
      <NavLink to='/Create' className='text-2xl font-bold text-blue-500'>
        Create Training
      </NavLink>
      <NavLink to='/List' className='text-2xl font-bold text-blue-500'>
        Training List
      </NavLink>
    </div>
  );
}

export default Header;
