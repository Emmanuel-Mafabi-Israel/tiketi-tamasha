import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const CustomerDashboard = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	return (
		<div className="dashboard-container">
			<h1>Welcome, {user?.fullName || "Guest"}!</h1>
			<p>Discover events, manage your tickets, and explore new experiences.</p>

			<div className="dashboard-actions">
				<button onClick={() => navigate("/events")}>Browse Events</button>
				<button onClick={() => navigate("/profile")}>My Tickets</button>
				<button onClick={logout}>Logout</button>
			</div>
		</div>
	);
};

export default CustomerDashboard;
