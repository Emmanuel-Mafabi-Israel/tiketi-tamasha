/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,

    EVENT CARD - ALL USERS
    BY ISRAEL MAFABI EMMANUEL
*/

import React from "react";
import "../styles/EventCard.css";
import { format, isPast, parseISO } from 'date-fns';

export default function EventCard({className = "tiketi-tamasha-event-card", cardImage, cardTitle, cardTime, cardLocation, onClick}) {
    let formatted_time = ""
    try {
        const date = parseISO(cardTime);
        const formattedDate = format(date, 'EEE, MMM, d, yyyy h:m a');
        formatted_time = formattedDate
    } catch (error) {
        console.log("error formatting time data.")
    }
    const isExpired = isPast(formatted_time);
    return (
        <div className={className} onClick={onClick}>
            <img className="card-image" src={cardImage} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{cardTitle}</div>
				<div className={`time ${isExpired ? 'expired': ''}`}>{isExpired ? 'Expired': formatted_time}</div>
                <div className="location">{cardLocation}</div>
            </div>
        </div>
    );
};