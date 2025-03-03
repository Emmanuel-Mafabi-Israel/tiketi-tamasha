import React, { useState, useEffect, useCallback } from "react";
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/events");
        if (!response.ok) throw new Error("Failed to load events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError("Error fetching events. Please try again later.");
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = async (eventId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
      if (!response.ok) throw new Error("Event not found");
      const data = await response.json();
      setSelectedEvent(data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const categories = [
    { name: "Conserve", icon: conserveIcon, events: "10K Events" },
    { name: "Fitness", icon: fitnessIcon, events: "3K Events" },
    { name: "Wellness", icon: wellnessIcon, events: "100K Events" },
    { name: "Finance", icon: financeIcon, events: "12K Events" },
  ];

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const filteredEvents = events.filter((event) =>
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === "" || event.category === selectedCategory) &&
    (selectedTag === "" || event.tags.includes(selectedTag)) &&
    (selectedLocation === "" || event.location.includes(selectedLocation))
  );

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
        <button className="login-btn">Login</button>
      </header>

      <section className="search-bar">
        <input
          type="text"
          placeholder="Search events by title, tags, category, or location..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="search-icon">🔍</button>
      </section>

      <section className="filter-options">
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by Tag"
          onChange={(e) => setSelectedTag(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Location"
          onChange={(e) => setSelectedLocation(e.target.value)}
        />
      </section>

      <section className="browse-category">
        <h2>Browse By Category</h2>
        <div className="category-buttons">
          {categories.map((category, index) => (
            <button
              key={index}
              className="category-btn"
              onClick={() => setSelectedCategory(category.name)}
            >
              <img src={category.icon} alt={`${category.name} Icon`} className="category-icon" />
              <span className="category-name">{category.name}</span>
              <span className="category-events">{category.events}</span>
            </button>
          ))}
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      <main className="event-main">
        <section className="popular-events">
          <h2>Popular Events</h2>
          <div className="event-cards">
            {isLoading ? (
              <p>Loading events...</p>
            ) : filteredEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="event-card-container">
                  <button className="event-card" onClick={() => handleEventClick(event.id)}>
                    <img src={event.image_url} alt={event.title} />
                    <h3>{event.title}</h3>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {selectedEvent && (
        <div className="event-panel active">
          <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
          <div className="event-info">
            <img src={selectedEvent.image_url} alt={selectedEvent.title} />
            <h2>{selectedEvent.title}</h2>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Start Date:</strong> {new Date(selectedEvent.start_date).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedEvent.end_date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Category:</strong> {selectedEvent.category}</p>
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
