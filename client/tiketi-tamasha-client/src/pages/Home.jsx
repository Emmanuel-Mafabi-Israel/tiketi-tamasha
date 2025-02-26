import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

import doodle_background from '../assets/tamasha_doodle_background.svg';

const Home = () => {
	const navigate = useNavigate();

	return (
		<div className='tiketi-tamasha-landing-page'>
			<img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
			<div className="tiketi-tamasha-landing-page-center">
				<h1 className='tiketi-tamasha-landing-heading'>The&nbsp;<b>Beat</b>&nbsp;of Your City,&nbsp;<span className="fade-text">Right Here.</span></h1>
				<p className='tiketi-tamasha-landing-explainer'>Set up an event, invite friends and sell tickets. <br />
					Host a memorable event today.</p>
				<button className='tiketi-tamasha-btn' onClick={() => navigate("/register")}>Register</button>
			</div>
		</div>
	);
};

export default Home;