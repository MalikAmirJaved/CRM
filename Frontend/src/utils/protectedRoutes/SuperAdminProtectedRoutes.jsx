import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SuperAdminProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.access!=="SuperAdmin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default SuperAdminProtectedRoute;