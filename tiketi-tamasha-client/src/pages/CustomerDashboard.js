import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

// ✅ Import Dashboard Icons
import icon1 from "../assets/icon1.svg/tiketi-tamasha-doodle-calendar.svg";
import icon2 from "../assets/icon2.svg/tiketi-tamasha-doodle-microphone.svg";
import icon3 from "../assets/icon3.svg/tiketi-tamasha-doodle-note-double.svg";
import icon4 from "../assets/icon4.svg/tiketi-tamasha-doodle-note-single.svg";
import icon5 from "../assets/icon5.svg/tiketi-tamasha-doodle-speaker.svg";

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* ✅ Background Icons */}
      <div className="dashboard-icons">
        <img src={icon1} alt="Icon" className="dashboard-icon icon-1" />
        <img src={icon2} alt="Icon" className="dashboard-icon icon-2" />
        <img src={icon3} alt="Icon" className="dashboard-icon icon-3" />
        <img src={icon4} alt="Icon" className="dashboard-icon icon-4" />
        <img src={icon5} alt="Icon" className="dashboard-icon icon-5" />
      </div>

      <div className="dashboard-card">
        <h1>Welcome, {user?.fullName || "Guest"}!</h1>
        <p>Discover events, manage your tickets, and explore new experiences.</p>

        <div className="dashboard-actions">
          <button onClick={() => navigate("/events")}>Browse Events</button>
          <button onClick={() => navigate("/tickets")}>My Tickets</button>
          <button onClick={() => navigate("/calendar")}>Calendar</button>
          <button onClick={() => navigate("/profile")}>Profile Settings</button>
          <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
