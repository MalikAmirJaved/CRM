import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Check if the user's role matches any of the allowed roles
  if (!user || user.access!=="Admin") {
    return <Navigate to="/" />; // Redirect to an unauthorized page if needed
  }

  return children;
};

export default AdminProtectedRoute;
