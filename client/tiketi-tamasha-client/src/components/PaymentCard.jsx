/*
    GLORY BE TO GOD,
    TICKET CARD,
    TIKETI TAMASHA,

    BY ISRAEL MAFABI EMMANUEL
*/

import React from "react";
import "../styles/PaymentCard.css";

import ticketSale from "../assets/tiketi-tamasha-transactions.svg";

export default function PaymentCard({paymentTitle, paymentStatus, paymentMethod, transactionID, paymentTime, amount, onClick}) {
    return (
        <div className="tiketi-tamasha-payment-card" onClick={onClick} 
        title={paymentStatus === "completed" ? "" : "Click to initiate Confirmation..."}>
            <img className="card-image" src={ticketSale} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{paymentTitle}</div>
                <div className={`status ${paymentStatus === "completed" ? "paid" : "unpaid"}`}>status: <span className="indicator">{paymentStatus}</span></div>
                <div className="method">method: {paymentMethod}</div>
                <div className="transaction">ID: {transactionID}</div>
                <div className="time">time: {paymentTime}</div>
                <div className="amount">amount: ksh {amount}</div>
            </div>
        </div>
    );
};