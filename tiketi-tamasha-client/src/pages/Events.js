import React from "react";
import EventCard from "../components/EventCard";
import "../styles/Events.css";

const Events = () => {
  const sampleEvents = [
    { id: 1, title: "Music Concert", date: "2025-03-10", location: "Nairobi" },
    { id: 2, title: "Tech Expo", date: "2025-04-15", location: "Mombasa" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleEvents.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
};

export default Events;
