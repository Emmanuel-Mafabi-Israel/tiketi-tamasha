/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	DISCOVER PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEventDetails } from "../api/eventService";
import "../styles/EventDetails.css";

export default function EventDetails({ input }) {
	const navigate = useNavigate();
	const [event, setEvent] = useState(null);

	useEffect(() => {
		getEventDetails(input.id).then(setEvent);
	}, [input.id]);

	if (!event) return <p>Loading event details...</p>;

	return (
		<div className="tiketi-tamasha-dialog-container">
			<div className="tiketi-tamasha-dialog">
				<div className="dialog-title">
					<img className="dialog-image" src="" alt="" />
					<div className="titles">
						<div className="heading"></div>
						<div className="subheading"></div>
					</div>
				</div>
				<div className="dialog-body">
					<div className="time-tickets">
						<div className="time">
							<div className="day"></div>
							<div className="start"></div>
							<div className="end"></div>
						</div>
						<div className="tickets"></div>
					</div>
					<div className="registration">
						<div className="title">Join Event</div>
						<div className="tiers">
							
						</div>
					</div>
					<div className="dialog-about">

					</div>
					<div className="location">
					</div>
				</div>
			</div>
		</div>
	);
};