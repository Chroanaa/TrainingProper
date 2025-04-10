import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/Home";

function HomeLayout() {
  return (
    <div className="flex h-screen">
      <Header />
      <div className="flex-1 p-3 overflow-y-scroll">
        {<Outlet />}
      </div>
    </div>
  );
}

export default HomeLayout;