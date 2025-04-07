import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/Home";

function HomeLayout() {
  return (
    <div className="flex">
      <Header />
      {<Outlet />}
    </div>
  );
}

export default HomeLayout;
