import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SalesProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  // If user is not logged in or user.admin is true, redirect to login
  if (!user || user.access!=="Sales") {
    return <Navigate to="/" />;
  }

  // Render children if user.admin is false
  return children;
};

export default SalesProtectedRoute;


