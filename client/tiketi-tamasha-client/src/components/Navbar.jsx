import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

import tiketi_tamasha_logo from "../assets/tiketi-tamasha-icon-high-res-white.svg";
import tiketi_explore_logo from "../assets/tiketi-tamasha-new-page-rounded.svg";

const Navbar = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	return (
		<nav className="tiketi-tamasha-navbar">
			<div className="tiketi-tamasha-logo" onClick={() => navigate("/")}>
				<img className="tiketi-tamasha-logo-image" src={tiketi_tamasha_logo} alt="tiketi-tamasha"></img>
				<div className="tiketi-tamasha-logo-title">
					<div className="head">Tiketi</div>
					<div className="enbold"><b>Tamasha</b></div>
				</div>
			</div>
			<div className="tiketi-tamasha-nav-links">
				{user ? (
					<div className="tiketi-tamasha-navbar-signed">
						<Link to={user.role === "organizer" ? "/organizer-dashboard" : "/dashboard"}>
							Dashboard
						</Link>
						<div className="cta">
							<Link to="/events" className="explore-link">
								<button className='tiketi-tamasha-btn special'>
									<div className="text">Explore events</div>
									<img className='explore' src={tiketi_explore_logo} alt="explore" />
								</button>
							</Link>
							<button className='tiketi-tamasha-btn' onClick={logout}>
								Logout
							</button>
						</div>
					</div>
				) : (
					<div className="tiketi-tamasha-navbar-unsigned">
						<Link to="/events" className="explore-link">
							<button className='tiketi-tamasha-btn special'>
								<div className="text">Explore events</div>
								<img className='explore' src={tiketi_explore_logo} alt="explore" />
							</button>
						</Link>
						<Link to="/Login" className="explore-link">
							<button className='tiketi-tamasha-btn'>
								Login
							</button>
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
