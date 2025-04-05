import React from "react";
import { NavLink, Outlet } from "react-router";
function Header() {
  return (
    <div>
      <NavLink to='/TrainingList' className='text-2xl font-bold text-blue-500'>
        Training List
      </NavLink>
      <NavLink to='/Create' className='text-2xl font-bold text-blue-500'>
        Create Training
      </NavLink>
    </div>
  );
}

export default Header;
