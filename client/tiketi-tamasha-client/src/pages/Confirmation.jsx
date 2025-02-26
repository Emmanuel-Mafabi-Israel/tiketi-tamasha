import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Confirmation.css";

const Confirmation = () => {
	const [searchParams] = useSearchParams();
	const eventId = searchParams.get("eventId");
	const quantity = searchParams.get("quantity");
	const navigate = useNavigate();

	return (
		<div className="confirmation-container">
			<h1>🎉 Purchase Confirmed! 🎟</h1>
			<p>Your tickets have been booked successfully.</p>
			<p><strong>Event ID:</strong> {eventId}</p>
			<p><strong>Tickets Purchased:</strong> {quantity}</p>

			<div className="confirmation-actions">
				<button onClick={() => navigate("/profile")}>View My Tickets</button>
				<button onClick={() => navigate("/events")}>Browse More Events</button>
			</div>
		</div>
	);
};

export default Confirmation;
