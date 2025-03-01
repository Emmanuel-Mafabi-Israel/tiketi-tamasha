import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";  // Import AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // ✅ Get user from AuthContext
  const isAuthenticated = user || localStorage.getItem("token"); // Ensure it's "token" not "access_token"

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
