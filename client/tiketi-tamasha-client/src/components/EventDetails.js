import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventDetails.css';
import eventImage from '../assets/high_res/tiketi-innovate.jpg';

const EventDetails = ({ closePanel }) => {
  return (
    <div className="event-details">
      <header className="event-header">
        <button className="close-btn" onClick={closePanel}>❌</button>
        <h1>Event Details</h1>
      </header>
      <main className="event-main">
        <section className="event-info">
          <img src={eventImage} alt="Event" />
          <h2>Product Talk With Christian Idiodi</h2>
          <p>Wednesday, February 26</p>
          <p>5:30 PM - 7:30 PM</p>
          <p>The Location Rooftop, Nairobi, Nairobi County</p>
          <button className="join-waitlist-btn">Join Waitlist</button>
        </section>
        <section className="event-description">
          <h3>Description</h3>
          <p>Details about the event go here...</p>
        </section>
      </main>
    </div>
  );
};

export default EventDetails;
