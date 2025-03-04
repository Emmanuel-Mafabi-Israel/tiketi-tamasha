import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const ProtectedRoute = ({ children }) => {
	const { user } = useContext(AuthContext); // Get the user from the AuthContext

	if (!user) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default ProtectedRoute;