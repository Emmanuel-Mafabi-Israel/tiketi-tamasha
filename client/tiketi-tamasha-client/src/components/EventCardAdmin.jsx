/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,

    EVENT CARD - ORGANIZERS
    BY ISRAEL MAFABI EMMANUEL
*/

import Button from "./Button";
import tiketi_galactic_event from '../assets/tiketi-tamasha-galactic.svg';
import { format, isPast, parseISO } from 'date-fns';

export default function EventCardAdmin({ className = "tiketi-tamasha-event-card admin", event, onEdit, onDelete }) {
    let formatted_time = ""
    try {
        const date = parseISO(event.end_date);
        const formattedDate = format(date, 'EEE, MMM, d, yyyy h:m a');
        formatted_time = formattedDate
    } catch (error) {
        console.log("error formatting time data.")
    }

    const isExpired = isPast(formatted_time);

    return (
        <div className={className}>
            <img className="card-image" src={tiketi_galactic_event} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{event.title}</div>
                <div className={`time ${isExpired ? 'expired': ''}`}>{isExpired ? 'Expired': formatted_time}</div>
                <div className="location">{event.location}</div>
            </div>
            <div className="card-event-interest">
                <div className={`title ${event.tickets_sold === event.total_tickets ? "sold_out" : ""}`}>{event.tickets_sold}<span>/{event.total_tickets}</span> </div>
                <div className="subtitle">{event.tickets_sold === event.total_tickets ? "sold out" : "tickets sold"}</div>
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