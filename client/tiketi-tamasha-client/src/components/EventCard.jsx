import React from "react";
// import { Link, useNavigate } from "react-router-dom";

import "../styles/EventCard.css";

export default function EventCard({cardImage, cardTitle, cardTime, cardLocation, flag="unsigned"}) {
	// const navigate = useNavigate()
    return (
        <div className="tiketi-tamasha-event-card">
            <img className="card-image" src={cardImage} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{cardTitle}</div>
				<div className="time">{cardTime}</div>
                <div className="location">{cardLocation}</div>
            </div>
        </div>
    );
};