/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    NAVIGATION BAR,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";

import "../styles/Navbar.css";

import tiketi_tamasha_logo from "../assets/tiketi-tamasha-icon-high-res-white.svg";
import tiketi_explore_logo from "../assets/tiketi-tamasha-new-page-rounded.svg";
import tiketi_return_logo from "../assets/tiketi-tamasha-return.svg";
// import doodle_background from '../assets/tamasha_doodle_background.svg';

import Button from "./Button";
import LoadingPage from "./LoadingPage"; // Import the loading spinner
import "../styles/Button.css";

export default function Navbar({ activeSection, setActiveSection }) {
    const { user, logout } = useContext(AuthContext); // Auth context for user and logout
    const { loading, setLoading } = useLoading(); // Loading context
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const isDiscoverPage = location.pathname === "/discover";

    // Handle navigation to Dashboard
    const handleNavigateToDashboard = () => {
        setLoading(true); // Start loading spinner
        setTimeout(() => {
            navigate("/dashboard"); // Navigate to Dashboard
            setLoading(false); // Stop spinner after navigation
        }, 2000); // Optional delay for effect
    };

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            logout(); // Call the logout function
            navigate("/login"); // Redirect to login page
            setLoading(false); // Stop spinner after navigation
        }, 2000);
    };

    if (loading) {
        return (
            <>
                <LoadingPage />
            </>
        );
    }


    return (
        <nav className="tiketi-tamasha-navbar">
            {/* Logo and navigation */}
            <div className={`tiketi-tamasha-logo ${user ? "signed" : ""}`} onClick={user ? handleNavigateToDashboard : () => navigate("/")}>
                <img className="tiketi-tamasha-logo-image" src={tiketi_tamasha_logo} alt="tiketi-tamasha" />
                <div className="tiketi-tamasha-logo-title">
                    <div className="head">Tiketi</div>
                    <div className="enbold"><b>Tamasha</b></div>
                </div>
            </div>
            <div className={`tiketi-tamasha-nav-links ${user ? "signed" : ""}`}>
                {/* If user is signed in */}
                {user ? (
                    <div className="tiketi-tamasha-navbar-signed">
                        {/* Discover page navigation */}
                        {isDiscoverPage ? (
                            <>
                                <div className="access-links"></div>
                                <div className="tiketi-tamasha-navbar-signed-btns">
                                    <Button
                                        className="tiketi-tamasha-btn special"
                                        buttonText="Return"
                                        image={tiketi_return_logo}
                                        alt="explore"
                                        onClick={handleNavigateToDashboard} // Navigate to Dashboard with spinner
                                    />
                                    <Button
                                        className="tiketi-tamasha-btn"
                                        buttonText="Logout"
                                        onClick={handleLogout} // Logout with spinner
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Organizer role navigation */}
                                {user.role === "organizer" ? (
                                    <>
                                        <div className="access-links">
                                            <div className={`link ${activeSection === "home" ? "selected" : ""}`} onClick={() => setActiveSection("home")}>
                                                Dashboard
                                            </div>
                                            <div className={`link ${activeSection === "events" ? "selected" : ""}`} onClick={() => setActiveSection("events")}>
                                                Events
                                            </div>
                                            <div className={`link ${activeSection === "settings" ? "selected" : ""}`} onClick={() => setActiveSection("settings")}>
                                                Settings
                                            </div>
                                        </div>
                                        <div className="tiketi-tamasha-navbar-signed-btns">
                                            <Button
                                                className="tiketi-tamasha-btn"
                                                buttonText="Logout"
                                                onClick={handleLogout} // Logout with spinner
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Regular user navigation */}
                                        <div className="access-links">
                                            <div className={`link ${activeSection === "home" ? "selected" : ""}`} onClick={() => setActiveSection("home")}>
                                                Home
                                            </div>
                                            <div className={`link ${activeSection === "tickets" ? "selected" : ""}`} onClick={() => setActiveSection("tickets")}>
                                                Tickets
                                            </div>
                                            <div className={`link ${activeSection === "upcoming" ? "selected" : ""}`} onClick={() => setActiveSection("upcoming")}>
                                                Upcoming
                                            </div>
                                            <div className={`link ${activeSection === "payments" ? "selected" : ""}`} onClick={() => setActiveSection("payments")}>
                                                Payments
                                            </div>
                                            <div className={`link ${activeSection === "settings" ? "selected" : ""}`} onClick={() => setActiveSection("settings")}>
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
                                                onClick={handleLogout} // Logout with spinner
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    /* If user is not signed in */
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