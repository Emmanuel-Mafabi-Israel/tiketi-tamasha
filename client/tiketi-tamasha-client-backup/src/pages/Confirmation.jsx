import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Confirmation.css";

const Confirmation = () => {
	const [searchParams] = useSearchParams();
	const eventId = searchParams.get("eventId");
	const quantity = searchParams.get("quantity");
	const navigate = useNavigate();

	useEffect(() => {
		Swal.fire({
			title: "🎉 Purchase Confirmed! 🎟",
			text: `Your tickets have been booked successfully.\n\nEvent ID: ${eventId}\nTickets Purchased: ${quantity}`,
			icon: "success",
			confirmButtonText: "OK",
		});
	}, [eventId, quantity]);

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
