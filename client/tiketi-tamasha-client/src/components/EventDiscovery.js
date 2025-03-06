import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventDiscovery.css";
import logo from "../assets/tiketi-tamasha-icon-high-res-white.svg";
import conserveIcon from "../assets/tiketi-tamasha-earth.svg";
import fitnessIcon from "../assets/tiketi-tamasha-run.svg";
import wellnessIcon from "../assets/tiketi-tamasha-wellness.svg";
import financeIcon from "../assets/tiketi-tamasha-finance.svg";
import EventDetails from "./EventDetails";

const EventDiscovery = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = [
    { name: "All", icon: null, events: "All Events" },
    { name: "Conserve", icon: conserveIcon, events: "10K Events" },
    { name: "Fitness", icon: fitnessIcon, events: "3K Events" },
    { name: "Wellness", icon: wellnessIcon, events: "100K Events" },
    { name: "Finance", icon: financeIcon, events: "12K Events" },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:5000/events");
        if (!response.ok) throw new Error("Failed to load events");
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        setError("Error fetching events. Please try again later.");
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === activeCategory));
    }
  }, [activeCategory, events]);

  const handleEventClick = async (eventId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
      if (!response.ok) throw new Error("Event not found");
      const data = await response.json();
      setSelectedEvent(data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Could not load event details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleSearchClick = () => {
    navigate("/search");
  };
  
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="event-discovery">
      <header className="event-header">
        <div className="logo-container">
          <img src={logo} alt="Tiketi Tamasha Logo" className="logo-img" />
          <div>
            <h1 className="site-name">Tiketi Tamasha</h1>
            <span>Browse Events</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="search-btn" onClick={handleSearchClick} aria-label="Search events">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <line x1="16.4142" y1="16" x2="20.4142" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className="login-btn">Login</button>
        </div>
      </header>

      <section className="browse-category">
        <h2>Browse By Category</h2>
        <div className="category-buttons">
          {categories.map((category, index) => (
            <button 
              key={index} 
              className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.icon && <img src={category.icon} alt={`${category.name} Icon`} className="category-icon" />}
              <span className="category-name">{category.name}</span>
              <span className="category-events">{category.events}</span>
            </button>
          ))}
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <main className="event-main">
        <section className="popular-events">
          <h2>{activeCategory === "All" ? "Popular Events" : `${activeCategory} Events`}</h2>
          
          {isLoading ? (
            <div className="skeleton-loader">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-details"></div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>No events found in this category.</p>
              <button onClick={() => setActiveCategory("All")} className="view-all-btn">
                View All Events
              </button>
            </div>
          ) : (
            <div className="event-cards">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card-container">
                  <button className="event-card" onClick={() => handleEventClick(event.id)}>
                    <img src={event.image_url} alt={event.title} />
                    {event.is_featured && <span className="event-badge">Featured</span>}
                    <div className="event-card-content">
                      <h3>{event.title}</h3>
                      <div className="event-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
                          <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" />
                          <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" />
                          <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" />
                        </svg>
                        {new Date(event.start_date).toLocaleDateString()}
                      </div>
                      <div className="event-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 21C16 17 20 13.4183 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13.4183 8 17 12 21Z" stroke="white" strokeWidth="2" />
                          <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="2" />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedEvent && (
        <div className="event-panel active">
          <button className="close-btn" onClick={handleCloseEvent}>×</button>
          <div className="event-info">
            <img src={selectedEvent.image_url} alt={selectedEvent.title} />
            <h2>{selectedEvent.title}</h2>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Start Date:</strong> {new Date(selectedEvent.start_date).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedEvent.end_date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Category:</strong> {selectedEvent.category}</p>
            <div className="event-actions">
              <button className="join-waitlist-btn">Join Waitlist</button>
              <button className="view-details-btn" onClick={() => navigate(`/events/${selectedEvent.id}`)}>
                View Full Details
              </button>
            </div>
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