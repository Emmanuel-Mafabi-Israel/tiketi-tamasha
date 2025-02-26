import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

// ✅ Import Background Icons
import icon1 from "../assets/icon1.svg/tiketi-tamasha-doodle-calendar.svg";  // Replace with actual icon images
import icon2 from "../assets/icon2.svg/tiketi-tamasha-doodle-microphone.svg";
import icon3 from "../assets/icon3.svg/tiketi-tamasha-doodle-note-double.svg";
import icon4 from "../assets/icon4.svg/tiketi-tamasha-doodle-note-single.svg";
import icon5 from "../assets/icon5.svg/tiketi-tamasha-doodle-speaker.svg";

const Home = () => {
	const navigate = useNavigate();

	return (
		<div className="home-container">
			{/* ✅ Background Icons */}
			<div className="hero-icons">
				<img src={icon1} alt="Music Icon" className="hero-icon icon-1" />
				<img src={icon2} alt="Music Icon" className="hero-icon icon-2" />
				<img src={icon3} alt="Music Icon" className="hero-icon icon-3" />
				<img src={icon4} alt="Music Icon" className="hero-icon icon-4" />
				<img src={icon5} alt="Music Icon" className="hero-icon icon-5" />
			</div>

			{/* ✅ Hero Section */}
			<h1 className="hero-title">
				The <span className="highlight">Beat</span> of Your City,{" "}
				<span className="fade-text">Right Here.</span>
			</h1>
			<p className="hero-text">
				Set up an event page, invite friends, and sell tickets. Host a memorable event today.
			</p>

			{/* ✅ Register Button */}
			<button onClick={() => navigate("/register")} className="hero-btn">
				Register
			</button>
		</div>
	);
};

export default Home;