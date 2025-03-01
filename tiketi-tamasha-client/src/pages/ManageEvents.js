import React, { useState, useEffect, useContext } from "react";
import { fetchOrganizerEvents, deleteEvent } from "../api/eventService";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "../styles/ManageEvents.css";

const ManageEvents = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      if (user && user.id) {
        try {
          const data = await fetchOrganizerEvents(user.id);
          setEvents(data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };

    getEvents();
  }, [user]);

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="manage-events-container">
      <h1>Manage Events</h1>
      {events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className="event-item">
            <h3>{event.title}</h3>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default ManageEvents;
