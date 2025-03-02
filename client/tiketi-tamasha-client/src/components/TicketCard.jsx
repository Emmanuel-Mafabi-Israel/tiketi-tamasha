/*
    GLORY BE TO GOD,
    TICKET CARD,
    TIKETI TAMASHA,

    BY ISRAEL MAFABI EMMANUEL
*/

import React from "react";
import "../styles/TicketCard.css";

import ticketSale from "../assets/tiketi-tamasha-sale.svg";

export default function TicketCard({card_image = ticketSale, ticketTitle, ticketType, ticketTime, onClick}) {
    return (
        <div className="tiketi-tamasha-ticket-card" onClick={onClick}>
            <img className="card-image" src={card_image} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{ticketTitle}</div>
                <div className="type">{ticketType}</div>
                <div className="time">{ticketTime}</div>
            </div>
        </div>
    );
};