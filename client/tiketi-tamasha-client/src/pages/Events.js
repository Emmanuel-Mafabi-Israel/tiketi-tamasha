import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../api/eventService";
import EventCard from "../components/EventCard";
import "../styles/Events.css";

const Events = () => {
	const [events, setEvents] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchEvents().then(setEvents);
	}, []);

	return (
		<div className="events-container">
			<h1>Upcoming Events</h1>
			<div className="event-list">
				{events.map(event => (
					<EventCard key={event.id} event={event} onClick={() => navigate(`/events/${event.id}`)} />
				))}
			</div>
		</div>
	);
};

export default Events;