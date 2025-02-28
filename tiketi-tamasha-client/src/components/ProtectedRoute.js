import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  // Check if user is logged in OR if a token exists in localStorage
  const isAuthenticated = user || localStorage.getItem("access_token");

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
