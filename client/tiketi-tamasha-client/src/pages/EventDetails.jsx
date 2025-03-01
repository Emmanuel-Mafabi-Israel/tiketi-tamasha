/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	DISCOVER PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import ar from '../assets/high_res/tiketi-augmented-reality.jpg';
import location from '../assets/tiketi-tamasha-gps.svg';

import React from "react";
import "../styles/EventDetails.css";
import "../styles/Button.css";

import Button from '../components/Button';

export default function EventDetails({ onClose }) {
	const dummyEvent = {
		title: "Sample Amazing Event",
		description: "A weekend of great music and fun!",
		location: "Central Park, Nairobi",
		category: "Music",
		tags: "music, festival, live",
		start_date: "2024-12-31T18:00:00",
		end_date: "2024-12-31T22:00:00",
		image_url: "https://example.com/musicfestival.jpg",
		ticket_tiers: {
			"Early Bird": {
				price: 1.00
			},
			"VIP": {
				price: 1.00
			},
			"Regular": {
				price: 1.00
			}
		},
		total_tickets: 700
	};

	return (
		<div className="tiketi-tamasha-dialog-container">
			<div className="tiketi-tamasha-dialog">
				<div className="dialog-title">
					<img className="dialog-image" src={ar} alt={dummyEvent.title} />
					<div className="titles">
						<div className="heading">{dummyEvent.title}</div>
						<div className="subheading">
							<div className="description">
								{dummyEvent.location}
							</div>
							<img className='location-indicator' src={location} alt="location" />
						</div>
					</div>
				</div>
				<div className="dialog-body">
					<div className="time-tickets">
						<div className="time">
							<div className="day">{new Date(dummyEvent.start_date).toLocaleDateString()}</div>
							<div className="start">starting at, {new Date(dummyEvent.start_date).toLocaleTimeString()}</div>
							<div className="end">ending at, {new Date(dummyEvent.end_date).toLocaleTimeString()}</div>
						</div>
						<div className="tickets">
							<div className="amount">{dummyEvent.total_tickets}</div>
							<div className="disclaimer">
								Tickets available
							</div>
						</div>
					</div>
					<div className="registration">
						<div className="title">Select a tier below to enroll</div>
						<div className="tiers">
							{Object.entries(dummyEvent.ticket_tiers).map(([tier, { price }]) => (
								<div key={tier} className="tier">
									<div className="tier-name">{tier}</div>
									<div className="tier-price">${price.toFixed(2)}</div>
								</div>
							))}
						</div>
					</div>
					<div className="dialog-about">
						<div className="title">About Event</div>
						<div className="about">
							{dummyEvent.description}
						</div>
					</div>
				</div>
				<div className="dialog-btns">
					<Button
						className="tiketi-tamasha-btn"
						buttonText="Close"
						onClick={onClose}
					/>
				</div>
			</div>
		</div>
	);
};