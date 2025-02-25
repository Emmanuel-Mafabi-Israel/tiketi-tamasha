import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="hero-title">
        The <span className="highlight">Beat</span> of Your City,{" "}
        <span className="fade-text">Right Here.</span>
      </h1>
      <p className="hero-text">
        Set up an event page, invite friends, and sell tickets. Host a memorable event today.
      </p>
      <button onClick={() => navigate("/register")} className="hero-btn">
        Register
      </button>
    </div>
  );
};

export default Home;
