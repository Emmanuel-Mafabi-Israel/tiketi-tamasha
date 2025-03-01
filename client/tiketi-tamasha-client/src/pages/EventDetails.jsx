/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	DISCOVER PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect } from "react";
import { getEventDetails } from "../api/eventService"; // Importing the function to get event details
import "../styles/EventDetails.css";
import "../styles/Button.css";
import Button from '../components/Button';
import locationIcon from '../assets/tiketi-tamasha-gps.svg';

export default function EventDetails({ eventId, onClose }) {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const data = await getEventDetails(eventId);
                setEvent(data);
            } catch (error) {
                console.error("Failed to fetch event details", error);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    if (!event) return <p>Loading event details...</p>;

    return (
        <div className="tiketi-tamasha-dialog-container">
            <div className="tiketi-tamasha-dialog">
                <div className="dialog-title">
                    <img className="dialog-image" src={event.image_url} alt={event.title} />
                    <div className="titles">
                        <div className="heading">{event.title}</div>
                        <div className="subheading">
                            <div className="description">{event.location}</div>
                            <img className='location-indicator' src={locationIcon} alt="location" />
                        </div>
                    </div>
                </div>
                <div className="dialog-body">
                    <div className="time-tickets">
                        <div className="time">
                            <div className="day">{new Date(event.start_date).toLocaleDateString()}</div>
                            <div className="start">starting at, {new Date(event.start_date).toLocaleTimeString()}</div>
                            <div className="end">ending at, {new Date(event.end_date).toLocaleTimeString()}</div>
                        </div>
                        <div className="tickets">
                            <div className="amount">{event.total_tickets}</div>
                            <div className="disclaimer">Tickets available</div>
                        </div>
                    </div>
                    <div className="registration">
                        <div className="title">Select a tier below to enroll</div>
                        <div className="tiers">
                            {Object.entries(event.ticket_tiers).map(([tier, { price }]) => (
                                <div key={tier} className="tier">
                                    <div className="tier-name">{tier}</div>
                                    <div className="tier-price">${price.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="dialog-about">
                        <div className="title">About Event</div>
                        <div className="about">{event.description}</div>
                    </div>
                </div>
                <div className="dialog-btns">
                    <Button className="tiketi-tamasha-btn" buttonText="Close" onClick={onClose} />
                </div>
            </div>
        </div>
    );
}