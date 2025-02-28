import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

import tiketi_tamasha_logo from "../assets/tiketi-tamasha-icon-high-res-white.svg";
import tiketi_explore_logo from "../assets/tiketi-tamasha-new-page-rounded.svg";
import tiketi_return_logo from "../assets/tiketi-tamasha-return.svg";

import Button from "./Button";
import "../styles/Button.css";

export default function Navbar() {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const isLoginPage = location.pathname === "/login";
	const isDiscoverPage = location.pathname === "/discover";

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
							<Button
								className="tiketi-tamasha-btn special"
								buttonText="Explore events"
								image={tiketi_explore_logo}
								alt="explore"
								onClick={() => navigate("/discover")}
							/>
							<Button
								className="tiketi-tamasha-btn"
								buttonText="Logout"
								onClick={logout}
							/>
						</div>
					</div>
				) : (
					<div className="tiketi-tamasha-navbar-unsigned">
						{isLoginPage ? (
							<div className="tiketi-tamasha-navbar-unsigned-btns">
								<Button
									className="tiketi-tamasha-btn special"
									buttonText="Return"
									image={tiketi_return_logo}
									alt="explore"
									onClick={() => navigate("/")}
								/>
							</div>
						) : isDiscoverPage ? (
							<div className="tiketi-tamasha-navbar-unsigned-btns">
								<Button
									className="tiketi-tamasha-btn special"
									buttonText="Return"
									image={tiketi_return_logo}
									alt="explore"
									onClick={() => navigate("/")}
								/>
								<Button
									className="tiketi-tamasha-btn"
									buttonText="Login"
									onClick={() => navigate("/login")}
								/>
							</div>
						) : (
							<div className="tiketi-tamasha-navbar-unsigned-btns">
								<Button
									className="tiketi-tamasha-btn special"
									buttonText="Explore events"
									image={tiketi_explore_logo}
									alt="explore"
									onClick={() => navigate("/discover")}
								/>
								<Button
									className="tiketi-tamasha-btn"
									buttonText="Login"
									onClick={() => navigate("/login")}
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</nav>
	);
};