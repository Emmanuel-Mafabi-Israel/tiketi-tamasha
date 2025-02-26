import React, { useState, useEffect } from "react";
import { fetchOrganizerEvents, deleteEvent } from "../api/eventService";
import "../styles/ManageEvents.css";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchOrganizerEvents().then(setEvents);
  }, []);

  const handleDelete = async (eventId) => {
    await deleteEvent(eventId);
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="manage-events-container">
      <h1>Manage Events</h1>
      {events.map(event => (
        <div key={event.id} className="event-item">
          <h3>{event.title}</h3>
          <button onClick={() => handleDelete(event.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ManageEvents;
