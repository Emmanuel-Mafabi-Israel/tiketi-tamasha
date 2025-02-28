import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import './EventDiscovery.css';

// Import images
import logo from '../assets/tiketi-tamasha-icon-high-res-white.svg';
import augmentedReality from '../assets/high_res/tiketi-augmented-reality.jpg';
import climateChange from '../assets/high_res/tiketi-climate-change.jpg';
import innovate from '../assets/high_res/tiketi-innovate.jpg';

// Import category icons
import conserveIcon from '../assets/tiketi-tamasha-earth.svg';
import fitnessIcon from '../assets/tiketi-tamasha-run.svg';
import wellnessIcon from '../assets/tiketi-tamasha-wellness.svg';
import financeIcon from '../assets/tiketi-tamasha-finance.svg';

const EventDiscovery = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate(); // Used to navigate to full event page

  const events = [
    { id: 1, name: 'AR Gadgets', image: augmentedReality, date: 'Feb 26', location: 'Nairobi' },
    { id: 2, name: 'Climate Change', image: climateChange, date: 'Mar 5', location: 'Mombasa' },
    { id: 3, name: 'AI Revolution', image: innovate, date: 'Apr 10', location: 'Kisumu' },
  ];

  const categories = [
    { name: 'Conserve', icon: conserveIcon, events: '10K Events' },
    { name: 'Fitness', icon: fitnessIcon, events: '3K Events' },
    { name: 'Wellness', icon: wellnessIcon, events: '100K Events' },
    { name: 'Finance', icon: financeIcon, events: '12K Events' },
  ];

  return (
    <div className="event-discovery">
      <header className="event-header">
        <div className="logo-container">
          <img src={logo} alt="Tiketi Tamasha Logo" className="logo-img" />
          <div>
            <h1 className="site-name">Tiketi Tamasha</h1>
            <span>Your Ultimate Event Guide</span>
          </div>
        </div>
        <button className="login-btn">Login</button>
      </header>

      <section className="browse-category">
        <h2>Browse By Category</h2>
        <div className="category-buttons">
          {categories.map((category, index) => (
            <button key={index} className="category-btn">
              <img src={category.icon} alt={`${category.name} Icon`} className="category-icon" />
              <span className="category-name">{category.name}</span>
              <span className="category-events">{category.events}</span>
            </button>
          ))}
        </div>
      </section>

      <main className="event-main">
        <section className="popular-events">
          <h2>Popular Events</h2>
          <div className="event-cards">
            {events.map((event) => (
              <div key={event.id} className="event-card-container">
                {/* Clicking the image opens the side panel */}
                <button className="event-card" onClick={() => setSelectedEvent(event)}>
                  <img src={event.image} alt={event.name} />
                  <h3>{event.name}</h3>
                </button>
                {/* Clicking "View Details" navigates to event page */}
                <button className="view-details-btn" onClick={() => navigate(`/event/${event.id}`)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Side Panel for Event Details */}
      {selectedEvent && (
        <div className={`event-panel ${selectedEvent ? 'active' : ''}`}>
          <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
          <div className="event-info">
            <img src={selectedEvent.image} alt={selectedEvent.name} />
            <h2>{selectedEvent.name}</h2>
            <p>{selectedEvent.date}</p>
            <p>{selectedEvent.location}</p>
            <button className="join-waitlist-btn">Join Waitlist</button>
          </div>
        </div>
      )}

      <footer className="event-footer">
        <p>&copy; Tiketi Tamasha by Tamasha Dev</p>
      </footer>
    </div>
  );
};

export default EventDiscovery;