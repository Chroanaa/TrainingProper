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
  LogOut,
  Shield
} from "lucide-react";

function Header() {
  const { logout } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  const currentLink = ({ isActive }) => ({
    color: isActive ? "#FFD700" : "white",
    fontWeight: isActive ? "bold" : "normal",
    backgroundColor: isActive ? "#3e4421" : "transparent",
    padding: "0.3rem",
    borderRadius: "0.25rem",
    transition: "all 0.3s ease",
  });

  return (
    <div className="flex flex-col bg-[#4B5320] h-full min-h-screen  p-2 shadow-lg">
      <div className="mb-4 flex flex-col items-center">
        <img src={Logo} alt="Logo" className="w-24 h-auto object-contain mb-1" />
        <p className="text-[#FFD700] font-bold text-center text-xs">
          QUEZON CITY UNIVERSITY
        </p>
        <p className="text-white text-xs text-center">
          Reserve Officer's Training Corps
        </p>
      </div>

      <nav className="flex flex-col gap-1 w-full flex-grow">
        <NavLink
          to="CourseMaterialPrep"
          className="text-xs hover:text-[#FFD700] flex items-center gap-1"
          style={currentLink}
        >
          <BookOpen size={14} />
          <span className="truncate">COURSE MATERIAL PREPARATION</span>
        </NavLink>

        <NavLink
          to="/List"
          className="text-xs hover:text-[#FFD700] flex items-center gap-1"
          style={currentLink}
        >
          <Calendar size={14} />
          <span>TRAINING PROGRAM</span>
        </NavLink>

        <NavLink
          to="/TrainingReport"
          className="text-xs hover:text-[#FFD700] flex items-center gap-1"
          style={currentLink}
        >
          <FileText size={14} />
          <span>TRAINING REPORT</span>
        </NavLink>

        <NavLink
          to="Create"
          className="text-xs hover:text-[#FFD700] flex items-center gap-1"
          style={currentLink}
        >
          <FilePlus size={14} />
          <span>REPORT CREATION</span>
        </NavLink>

        <NavLink
          to="IncidentReport"
          className="text-xs hover:text-[#FFD700] flex items-center gap-1"
          style={currentLink}
        >
          <AlertTriangle size={14} />
          <span>INCIDENT REPORT</span>
        </NavLink>

        <NavLink
          to="/SendDocument"
          className="text-xs hover:text-[#FFD700] flex items-center gap-1"
          style={currentLink}
        >
          <Send size={14} />
          <span>SEND DOCUMENT</span>
        </NavLink>
        
        <NavLink
  to="/CDC"
  className="text-xs hover:text-[#FFD700] flex items-center gap-1"
  style={currentLink}
>
  <Shield size={14} />
  <span>CDC</span>
</NavLink>

      </nav>
      
      <div className="mt-auto pt-2">
        <Button
          onClick={() => setOpen(true)}
          sx={{
            justifyContent: "flex-start",
            color: "white",
            textTransform: "none",
            fontSize: "0.7rem",
            padding: "0.4rem",
            "&:hover": {
              color: "#FFD700",
              backgroundColor: "transparent",
            },
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          <LogOut size={14} />
          <span>LOGOUT</span>
        </Button>
      </div>

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