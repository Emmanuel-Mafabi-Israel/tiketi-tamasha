import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import LoadingPage from "./LoadingPage";

const ProtectedRoute = ({ children }) => {
    const { user, authIsReady } = useContext(AuthContext);

    if (!authIsReady) {
        return (
            <>
                <LoadingPage />
            </>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;