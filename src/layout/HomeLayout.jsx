import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Adjusted import path
function HomeLayout() {
  return (
    <div>
      <Header />

      {<Outlet />}
    </div>
  );
}

export default HomeLayout;
