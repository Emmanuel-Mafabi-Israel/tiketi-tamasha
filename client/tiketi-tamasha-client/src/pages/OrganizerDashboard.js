import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const OrganizerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.fullName || "Organizer"}!</h1>
      <p>Manage your events, track ticket sales, and grow your audience.</p>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/create-event")}>Create Event</button>
        <button onClick={() => navigate("/manage-events")}>Manage Events</button>
        <button onClick={() => navigate("/profile")}>Profile Settings</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
