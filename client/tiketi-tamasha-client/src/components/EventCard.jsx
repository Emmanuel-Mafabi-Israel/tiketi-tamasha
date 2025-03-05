import React from "react";
import "../styles/EventCard.css";

export default function EventCard({className = "tiketi-tamasha-event-card", cardImage, cardTitle, cardTime, cardLocation, onClick}) {
	// const navigate = useNavigate()
    console.log(cardImage);
    return (
        <div className={className} onClick={onClick}>
            <img className="card-image" src={cardImage} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{cardTitle}</div>
				<div className="time">{cardTime}</div>
                <div className="location">{cardLocation}</div>
            </div>
        </div>
    );
};