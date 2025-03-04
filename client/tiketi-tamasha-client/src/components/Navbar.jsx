/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	NAVIGATION BAR,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

import tiketi_tamasha_logo from "../assets/tiketi-tamasha-icon-high-res-white.svg";
import tiketi_explore_logo from "../assets/tiketi-tamasha-new-page-rounded.svg";
import tiketi_return_logo from "../assets/tiketi-tamasha-return.svg";

import Button from "./Button";
import "../styles/Button.css";

export default function Navbar({ activeSection, setActiveSection }) {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const isLoginPage = location.pathname === "/login";
	const isDiscoverPage = location.pathname === "/discover";
	// const isDashboard = location.pathname === "/dashboard";

	return (
		<nav className="tiketi-tamasha-navbar">
			<div className={`tiketi-tamasha-logo ${user ? "signed" : ""}`} onClick={user ? () => navigate("/dashboard") : () => navigate("/")}>
				<img className="tiketi-tamasha-logo-image" src={tiketi_tamasha_logo} alt="tiketi-tamasha"></img>
				<div className="tiketi-tamasha-logo-title">
					<div className="head">Tiketi</div>
					<div className="enbold"><b>Tamasha</b></div>
				</div>
			</div>
			<div className={`tiketi-tamasha-nav-links ${user ? "signed" : ""}`}>
				{user ? (
					<div className="tiketi-tamasha-navbar-signed">
						{isDiscoverPage ? (
							<>
								<div className="access-links"></div>
								<div className="tiketi-tamasha-navbar-signed-btns">
									<Button
										className="tiketi-tamasha-btn special"
										buttonText="Return"
										image={tiketi_return_logo}
										alt="explore"
										onClick={() => navigate("/dashboard")}
									/>
									<Button
										className="tiketi-tamasha-btn"
										buttonText="Logout"
										onClick={logout}
									/>
								</div>
							</>
						) : (
							<>
								{user.role === "organizer" ? (
									<>
										<div className="access-links">
											{/* className="link" */}
											<div className={`link ${activeSection === "home" ? "selected" : ""}`} onClick={() => setActiveSection('home')}>
												Dashboard
											</div>
											<div className={`link ${activeSection === "events" ? "selected" : ""}`} onClick={() => setActiveSection('events')}>
												Events
											</div>
											<div className={`link ${activeSection === "settings" ? "selected" : ""}`} onClick={() => setActiveSection('settings')}>
												Settings
											</div>
										</div>
										<div className="tiketi-tamasha-navbar-signed-btns">
											<Button
												className="tiketi-tamasha-btn"
												buttonText="Logout"
												onClick={logout}
											/>
										</div>
									</>
								) : (
									<>
										<div className="access-links">
											{/* className="link" */}
											<div className={`link ${activeSection === "home" ? "selected" : ""}`} onClick={() => setActiveSection('home')}>
												Home
											</div>
											<div className={`link ${activeSection === "tickets" ? "selected" : ""}`} onClick={() => setActiveSection('tickets')}>
												Tickets
											</div>
											<div className={`link ${activeSection === "upcoming" ? "selected" : ""}`} onClick={() => setActiveSection('upcoming')}>
												Upcoming
											</div>
											<div className={`link ${activeSection === "payments" ? "selected" : ""}`} onClick={() => setActiveSection('payments')}>
												Payments
											</div>
											<div className={`link ${activeSection === "settings" ? "selected" : ""}`} onClick={() => setActiveSection('settings')}>
												Settings
											</div>
										</div>
										<div className="tiketi-tamasha-navbar-signed-btns">
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
									</>
								)}
							</>
						)}
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