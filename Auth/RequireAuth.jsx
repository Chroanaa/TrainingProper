import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
function RequireAuth() {
  const auth = sessionStorage.getItem("token");
  const location = useLocation();
  if (!auth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
