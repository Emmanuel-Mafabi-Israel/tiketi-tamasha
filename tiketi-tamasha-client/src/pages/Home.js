import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Importing Home-specific CSS

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">
          The <span className="highlight">Beat</span> of Your City,{" "}
          <span className="light-text">Right Here.</span>
        </h1>
        <p className="hero-subtitle">
          Set up an event page, invite friends, and sell tickets.
          <br /> Host a memorable event today.
        </p>
        <Link to="/register" className="register-button">
          Register
        </Link>
      </div>

      <footer className="footer">Tiketi Tamasha by Tamasha Dev</footer>
    </div>
  );
};

export default Home;
