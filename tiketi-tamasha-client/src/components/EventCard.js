import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p>{event.date}</p>
      <p>{event.location}</p>
      <Link to={`/events/${event.id}`} className="text-blue-500">View Details</Link>
    </div>
  );
};

export default EventCard;
