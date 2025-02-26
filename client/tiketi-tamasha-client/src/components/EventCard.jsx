import React from "react";
import { Link } from "react-router-dom";
import "../styles/EventCard.css";

const EventCard = ({ event }) => {
	return (
		<div className="event-card">
			<img src={event.image} alt={event.title} />
			<h3>{event.title}</h3>
			<p>{event.date} | {event.location}</p>
			<Link to={`/events/${event.id}`} className="details-btn">View Details</Link>
		</div>
	);
};

export default EventCard;