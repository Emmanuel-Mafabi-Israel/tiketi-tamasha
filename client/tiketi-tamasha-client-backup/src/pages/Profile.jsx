import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserTickets, updateUserProfile } from "../api/userService";
import "../styles/Profile.css";

const Profile = () => {
	const { user, logout } = useContext(AuthContext);
	const [tickets, setTickets] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [updatedData, setUpdatedData] = useState({ fullName: user?.fullName, email: user?.email });

	useEffect(() => {
		getUserTickets(user?.id).then(setTickets);
	}, [user]);

	const handleUpdate = async () => {
		await updateUserProfile(user.id, updatedData);
		setEditMode(false);
	};

	return (
		<div className="profile-container">
			<h1>My Profile</h1>

			<div className="profile-info">
				<label>Full Name:</label>
				{editMode ? (
					<input type="text" value={updatedData.fullName} onChange={(e) => setUpdatedData({ ...updatedData, fullName: e.target.value })} />
				) : (
					<p>{user?.fullName}</p>
				)}

				<label>Email:</label>
				{editMode ? (
					<input type="email" value={updatedData.email} onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })} />
				) : (
					<p>{user?.email}</p>
				)}

				{editMode ? (
					<button onClick={handleUpdate}>Save Changes</button>
				) : (
					<button onClick={() => setEditMode(true)}>Edit Profile</button>
				)}
			</div>

			<h2>My Tickets</h2>
			<div className="ticket-list">
				{tickets.length === 0 ? <p>No tickets purchased yet.</p> : tickets.map((ticket) => (
					<div key={ticket.id} className="ticket-item">
						<p><strong>Event:</strong> {ticket.eventTitle}</p>
						<p><strong>Quantity:</strong> {ticket.quantity}</p>
						<p><strong>Date:</strong> {ticket.date}</p>
					</div>
				))}
			</div>

			<button onClick={logout} className="logout-btn">Logout</button>
		</div>
	);
};

export default Profile;
