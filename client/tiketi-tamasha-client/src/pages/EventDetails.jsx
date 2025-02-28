/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    DISCOVER PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventDetails } from "../api/eventService";
import "../styles/EventDetails.css";

export default function EventDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [event, setEvent] = useState(null);

	useEffect(() => {
		getEventDetails(id).then(setEvent);
	}, [id]);

	if (!event) return <p>Loading event details...</p>;

	return (
		<div className="event-details-container">
			<h1>{event.title}</h1>
			<p>{event.description}</p>
			<p><strong>Date:</strong> {event.date}</p>
			<p><strong>Location:</strong> {event.location}</p>
			<p><strong>Price:</strong> ${event.price}</p>
			<button onClick={() => navigate(`/purchase?eventId=${id}`)}>Buy Ticket</button>
		</div>
	);
};