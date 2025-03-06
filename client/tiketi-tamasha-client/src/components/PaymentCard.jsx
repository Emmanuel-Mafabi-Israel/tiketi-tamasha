// PaymentCard.js
import React from "react";
import "../styles/PaymentCard.css";
import ticketSale from "../assets/tiketi-tamasha-transactions.svg";

export default function PaymentCard({
    paymentTitle,
    paymentStatus,
    paymentMethod,
    transactionID,
    paymentTime,
    amount,
    checkoutRequestId, // checkout-request id
    token, // token...
    onClick,
}) {
    const handleClick = async () => {
        if (paymentStatus === "pending") {
            if (window.confirm("Do you want to initiate confirmation?")) {
                try {
                    const response = await onClick(checkoutRequestId, token); // Call onClick with checkoutRequestId and token
                    if (response.status === 'success'){
                        alert("Please wait 5 minutes and refresh the page to see the updated status.");
                    } else {
                        alert(response.message);
                    }
                } catch (error) {
                    alert("An error occurred while querying payment status.");
                    console.error("Error querying payment status:", error);
                }
            }
        }
    };

    return (
        <div
            className="tiketi-tamasha-payment-card"
            onClick={handleClick}
            title={
                paymentStatus === "completed" ||
                paymentStatus === "cancelled" ||
                paymentStatus === "failed"
                    ? ""
                    : "Click to initiate Confirmation..."
            }
        >
            <img className="card-image" src={ticketSale} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{paymentTitle}</div>
                <div className={`status ${paymentStatus === "completed" ? "paid" : "unpaid"}`}>
                    status: <span className="indicator">{paymentStatus}</span>
                </div>
                <div className="method">method: {paymentMethod}</div>
                <div className="transaction">ID: {transactionID}</div>
                <div className="time">time: {paymentTime}</div>
                <div className="amount">amount: ksh {amount}</div>
            </div>
        </div>
    );
}