/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    LOGIN PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "../styles/Home.css";

import doodle_background from '../assets/tamasha_doodle_background.svg';

export default function Home() {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext); // Get user from AuthContext

	useEffect(() => {
		// Redirect if already logged in
		if (user) {
			navigate(user.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
		}
	}, [user, navigate]); // Add dependencies

	return (
		<div className='tiketi-tamasha-landing-page'>
			<img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
			<div className="tiketi-tamasha-landing-page-center">
				<h1 className='tiketi-tamasha-landing-heading'>The <b>Beat</b> of Your City, <span className="fade-text">Right Here.</span></h1>
				<p className='tiketi-tamasha-landing-explainer'>Set up an event, invite friends and sell tickets. <br />
					Host a memorable event today.</p>
				<button className='tiketi-tamasha-btn' onClick={() => navigate("/register")}>Register</button>
			</div>
		</div>
	);
};