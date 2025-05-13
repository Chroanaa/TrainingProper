import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../assets/images/logo.png";
import { Button } from "@mui/material";
import LogoutModal from "./LogoutModal";
import { AuthContext } from "../../Auth/AuthProvider";
// Import icons
import {
  BookOpen,
  Calendar,
  FileText,
  FilePlus,
  AlertTriangle,
  Send,
  LogOut
} from "lucide-react";

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
          Reserve Officer's Training Corps
        </p>
      </div>

      <nav className='flex flex-col gap-2 mt-4 w-full'>
        <NavLink
          to='CourseMaterialPrep'
          className='text-[0.75rem] hover:text-[#FFD700] flex items-center gap-2'
          style={currentLink}
        >
          <BookOpen size={16} />
          <span>COURSE MATERIAL PREPARATION</span>
        </NavLink>

        <NavLink
          to='/List'
          className='text-[0.75rem] hover:text-[#FFD700] flex items-center gap-2'
          style={currentLink}
        >
          <Calendar size={16} />
          <span>TRAINING PROGRAM</span>
        </NavLink>

        <NavLink
          to='/TrainingReport'
          className='text-[0.75rem] hover:text-[#FFD700] flex items-center gap-2'
          style={currentLink}
        >
          <FileText size={16} />
          <span>TRAINING REPORT</span>
        </NavLink>

        <NavLink
          to='Create'
          className='text-[0.75rem] hover:text-[#FFD700] flex items-center gap-2'
          style={currentLink}
        >
          <FilePlus size={16} />
          <span>REPORT CREATION</span>
        </NavLink>

        <NavLink
          to='IncidentReport'
          className='text-[0.75rem] hover:text-[#FFD700] flex items-center gap-2'
          style={currentLink}
        >
          <AlertTriangle size={16} />
          <span>INCIDENT REPORT</span>
        </NavLink>

        <NavLink
          to='/SendDocument'
          className='text-[0.75rem] hover:text-[#FFD700] flex items-center gap-2'
          style={currentLink}
        >
          <Send size={16} />
          <span>SEND DOCUMENT</span>
        </NavLink>

        <Button
          onClick={() => setOpen(true)}
          sx={{
            justifyContent: "flex-start",
            color: "white",
            textTransform: "none",
            fontSize: "0.75rem",
            padding: "0.5rem",
            "&:hover": {
              color: "#FFD700",
              backgroundColor: "transparent",
            },
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <LogOut size={16} />
          <span>LOGOUT</span>
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