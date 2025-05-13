import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../assets/images/logo.png";
import { Button } from "@mui/material";
import LogoutModal from "./LogoutModal";
import { AuthContext } from "../../Auth/AuthProvider";

function Header() {
  const { logout } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  const currentLink = ({ isActive }) => ({
    color: isActive ? "#FFD700" : "white",
    fontWeight: isActive ? "bold" : "normal",
    backgroundColor: isActive ? "#3e4421" : "transparent",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    transition: "all 0.3s ease",
  });

  return (
    <div className='flex flex-col bg-[#4B5320] h-screen w-[20%] p-4 shadow-lg'>
      <div className='mb-6 flex flex-col items-center'>
        <img src={Logo} alt='Logo' className='w-100 h-25 object-contain mb-2' />
        <p className='text-[#FFD700] font-bold text-center text-sm'>
          QUEZON CITY UNIVERSITY
        </p>
        <p className='text-white text-[0.7rem] text-center'>
          Reserve Officer’s Training Corps
        </p>
      </div>

      <nav className='flex flex-col gap-2 mt-4 w-full'>
        <NavLink
          to='CourseMaterialPrep'
          className='text-[0.75rem] hover:text-[#FFD700]'
          style={currentLink}
        >
          COURSE MATERIAL PREPARATION
        </NavLink>

        <NavLink
          to='/List'
          className='text-[0.75rem] hover:text-[#FFD700]'
          style={currentLink}
        >
          TRAINING PROGRAM
        </NavLink>

        <NavLink
          to='/TrainingReport'
          className='text-[0.75rem] hover:text-[#FFD700]'
          style={currentLink}
        >
          TRAINING REPORT
        </NavLink>

        <NavLink
          to='Create'
          className='text-[0.75rem] hover:text-[#FFD700]'
          style={currentLink}
        >
          REPORT CREATION
        </NavLink>

        <NavLink
          to='IncidentReport'
          className='text-[0.75rem] hover:text-[#FFD700]'
          style={currentLink}
        >
          INCIDENT REPORT
        </NavLink>

        <NavLink
          to='/SendDocument'
          className='text-[0.75rem] hover:text-[#FFD700]'
          style={currentLink}
        >
          SEND DOCUMENT
        </NavLink>

        <Button
          onClick={() => setOpen(true)}
          sx={{
            justifyContent: "flex-start",
            color: "white",
            textTransform: "none",
            fontSize: "0.75rem",
            "&:hover": {
              color: "#FFD700",
              backgroundColor: "transparent",
            },
          }}
        >
          LOGOUT
        </Button>
      </nav>

      <LogoutModal
        open={open}
        handleClose={() => setOpen(false)}
        handleLeaveEvent={() => {
          sessionStorage.removeItem("token");
          setOpen(false);
          logout();
          window.location.reload();
        }}
      />
    </div>
  );
}

export default Header;
