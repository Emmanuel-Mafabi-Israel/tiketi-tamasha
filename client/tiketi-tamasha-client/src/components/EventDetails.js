// EventDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState("");
  const [error, setError] = useState(null);

  const handleBooking = () => {
    if (!ticketType) {
      setError("Please select a ticket type.");
      return;
    }
    // Implement booking logic here
    alert(`Booking ${ticketType} ticket for ${event.title}`);
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const calendarEvent = {
      title: event.title,
      start: event.start_date,
      end: event.end_date,
      location: event.location,
      description: event.description,
    };

    // Create a calendar event download link
    const calendarLink = `data:text/calendar;charset=utf8,${encodeURIComponent([
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${event.id}`,
      `DTSTART:${new Date(calendarEvent.start).toISOString().replace(/-|:|\.\d+/g, "")}`,
      `DTEND:${new Date(calendarEvent.end).toISOString().replace(/-|:|\.\d+/g, "")}`,
      `SUMMARY:${calendarEvent.title}`,
      `LOCATION:${calendarEvent.location}`,
      `DESCRIPTION:${calendarEvent.description}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n"))}`;

    const link = document.createElement("a");
    link.href = calendarLink;
    link.download = `${event.title}.ics`;
    link.click();
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/events/${eventId}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError("Error fetching event details. Please try again later.");
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-details">
      {error && <div className="error">{error}</div>}
      <h1>{event.title}</h1>
      <img src={event.image_url} alt={event.title} />
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Organizer:</strong> {event.organizer.email}</p>
      <p><strong>Early Booking Price:</strong> {event.early_price}</p>
      <p><strong>VIP Price:</strong> {event.vip_price}</p>
      <p><strong>Regular Price:</strong> {event.regular_price}</p>

      <div>
        <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
          <option value="">Select Ticket Type</option>
          <option value="early">Early Booking</option>
          <option value="vip">VIP</option>
          <option value="regular">Regular</option>
        </select>
        <button onClick={handleBooking}>Book Ticket</button>
      </div>

      <button onClick={handleAddToCalendar}>Add to Calendar</button>
    </div>
  );
};

export default EventDetails;
