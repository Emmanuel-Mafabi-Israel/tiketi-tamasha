/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,

    EVENT CARD - ORGANIZERS
    BY ISRAEL MAFABI EMMANUEL
*/

import Button from "./Button";

import tiketi_galactic_event from '../assets/tiketi-tamasha-galactic.svg';

export default function EventCardAdmin({ className = "tiketi-tamasha-event-card admin", event, onEdit, onDelete }) {
    return (
        <div className={className}>
            <img className="card-image" src={tiketi_galactic_event} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{event.title}</div>
                <div className="time">{`${event.start_date}|${event.start_date}`}</div>
                <div className="location">{event.location}</div>
            </div>
            <div className="card-actions">
                <Button
                    className=""
                    buttonText="Edit"
                    onClick={onEdit} // Call the onEdit function passed as a prop
                />
                <Button
                    className="red"
                    buttonText="Delete"
                    onClick={() => onDelete(event.id)} // Call the onDelete function with the event ID
                />
            </div>
        </div>
    );
};