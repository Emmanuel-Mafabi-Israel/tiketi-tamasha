import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getEventDetails } from "../api/eventService";
import "../styles/Purchase.css";

const Purchase = () => {
	const [searchParams] = useSearchParams();
	const eventId = searchParams.get("eventId");
	const navigate = useNavigate();
	const [event, setEvent] = useState(null);
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		getEventDetails(eventId).then(setEvent);
	}, [eventId]);

	const handlePurchase = () => {
		navigate(`/confirmation?eventId=${eventId}&quantity=${quantity}`);
	};

	if (!event) return <p>Loading event details...</p>;

	return (
		<div className="purchase-container">
			<h1>Buy Tickets for {event.title}</h1>
			<p><strong>Price per Ticket:</strong> ${event.price}</p>
			<label>Number of Tickets:</label>
			<input type="number" value={quantity} min="1" onChange={(e) => setQuantity(e.target.value)} />
			<p><strong>Total Price:</strong> ${event.price * quantity}</p>
			<button onClick={handlePurchase}>Proceed to Payment</button>
		</div>
	);
};

export default Purchase;
