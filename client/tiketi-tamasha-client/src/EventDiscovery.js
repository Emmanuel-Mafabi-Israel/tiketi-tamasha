import React from "react";
import "./EventDiscovery.css"; // Import the CSS file

// ✅ Import assets from the `src/assets/` folder
import logo from "./assets/tiketi-tamasha-logo.svg";  
import highResImage from "./assets/high_res/tiketi-augmented-reality.jpg";  

const categories = [
  { name: "Research", events: "1K Events", icon: "🔬" },
  { name: "Conserve", events: "10K Events", icon: "🌍" },
  { name: "Fitness", events: "3K Events", icon: "🏃‍♂️" },
  { name: "Wellness", events: "100K Events", icon: "❤️" },
  { name: "Finance", events: "12K Events", icon: "💳" },
  { name: "Music", events: "5K Events", icon: "🎤" },
];

const popularEvents = [
  {
    name: "AR Gadgets",
    date: "Thu, Feb 27, 2:00 PM",
    location: "University of Adelaide",
    image: highResImage, // ✅ Using imported image
  },
  {
    name: "Climate Change",
    date: "Wed, Jun 1, 2:00 PM",
    location: "Huddersfield",
    image: "https://source.unsplash.com/100x100/?climate",
  },
  {
    name: "AI Revolution",
    date: "Thu, Feb 27, 3:00 PM",
    location: "Tel Aviv",
    image: "https://source.unsplash.com/100x100/?ai",
  },
];

const EventDiscovery = () => {
  return (
    <div className="event-discovery">
      <header className="header-container">
        <div className="logo-container">
          <img src={logo} alt="Tiketi Tamasha Logo" className="logo-img" />
          <span className="site-name">Tiketi Tamasha</span>
        </div>
        <button className="login-btn">Login</button>
      </header>

      <section className="categories">
        <h2>Browse By Category</h2>
        <div className="category-list">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <span className="icon">{category.icon}</span>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.events}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="popular-events">
        <h2>Popular Events</h2>
        <div className="event-list">
          {popularEvents.map((event, index) => (
            <div key={index} className="event-card">
              <img src={event.image} alt={event.name} />
              <div className="event-info">
                <h3>{event.name}</h3>
                <p>{event.date}</p>
                <p>{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>Tiketi <strong>Tamasha</strong> by Tamasha Dev</p>
      </footer>
    </div>
  );
};

export default EventDiscovery;
