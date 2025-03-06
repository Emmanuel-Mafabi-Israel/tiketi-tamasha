/*
GLORY BE TO GOD,
TIKETI TAMASHA,
DISCOVER PAGE,

BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect } from "react";
import { getEventDetails } from "../api/eventService";
import ticketService from "../api/ticketService";
import "../styles/EventDetails.css";
import "../styles/Button.css";
import Button from '../components/Button';
import locationIcon from '../assets/tiketi-tamasha-gps.svg';
import LoadingPage from "../components/LoadingPage";
import Swal from "sweetalert2";

import { format, isPast, parseISO } from 'date-fns';

export default function EventDetails({ eventId, onClose, flag, user, onPurchaseSuccess }) { // Receive onPurchaseSuccess
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState(null);
    // const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const data = await getEventDetails(eventId);
                setEvent(data);
            } catch (error) {
                console.error("Failed to fetch event details", error);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    let formatted_time = ""
    try {
        const date = parseISO(event?.end_date);
        const formattedDate = format(date, 'EEE, MMM, d, yyyy h:m a');
        formatted_time = formattedDate
    } catch (error) {
        console.log("error formatting time data.")
    }
    const isExpired = isPast(formatted_time);

    const handleUnsignedUser = (tier) => {
        setSelectedTier(tier);
    };

    const handleTierClick = async (tier, amount) => {
        setSelectedTier(tier);
        if (flag === "unsigned") {
            setSelectedTier(tier);
        } else {
            try {
                if (isExpired) {
                    const ok_pressed = await Swal.fire({
                        title: 'Expired Event',
                        text: 'The Current Event selected has expired!'
                    });
                    if (ok_pressed.isConfirmed) {
                        onClose()
                    }
                } else {
                    const data = {
                        event_id: eventId,
                        ticket_type: tier,
                        phone_number: user.phone_number,
                        amount: amount,
                    };
                    // console.log(data); -> for debugging purposes...
                    await ticketService.purchaseTicket(data);
                    const ok_pressed = await Swal.fire({
                        title: 'STK Push Sent',
                        text: 'Please do check your Phone!'
                    });
                    if (ok_pressed.isConfirmed) {
                        if (onPurchaseSuccess) { // Call the callback on successful purchase
                            onPurchaseSuccess();
                        }
                    }
                    if (onPurchaseSuccess) { // Call the callback on successful purchase
                        onPurchaseSuccess();
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'STK Push Sent Failed',
                    text: 'Failed to send STK Push, Please try again later.'
                });
                console.error("Failed to send STK Push", error);
            }
        }
    };

    return (
        <div className="tiketi-tamasha-dialog-container">
            {loading && <LoadingPage />}
            <div className="tiketi-tamasha-dialog">
                <div className="dialog-title">
                    <img className="dialog-image" src={event?.image_url} alt={event?.title} />
                    <div className="titles">
                        <div className="heading">{event?.title}&nbsp; <span>{isExpired ? "EXPIRED" : ""}</span></div>
                        <div className="subheading">
                            <div className="description">{event?.location}</div>
                            <img className='location-indicator' src={locationIcon} alt="location" />
                        </div>
                    </div>
                </div>
                <div className="dialog-body">
                    <div className="time-tickets">
                        <div className="time">
                            <div className="day">{new Date(event?.start_date).toLocaleDateString()}</div>
                            <div className="start">starting at, {new Date(event?.start_date).toLocaleTimeString()}</div>
                            <div className="end">ending at, {new Date(event?.end_date).toLocaleTimeString()}</div>
                        </div>
                        <div className="tickets">
                            <div className="amount">{event?.total_tickets}</div>
                            <div className={`disclaimer ${event?.total_tickets === event?.tickets_sold ? "sold_out" : ""}`}>{event?.total_tickets === event?.tickets_sold ? "Sold out!" : "Tickets available"}</div>
                        </div>
                    </div>
                    <div className="registration">
                        <div className="title">Select a tier below to enroll</div>
                        <div className="tiers">
                            {event && Object.entries(event.ticket_tiers).map(([tier, { price }]) => {
                                const numericPrice = parseFloat(price);
                                return (
                                    <div key={tier} className={`tier ${isExpired ? 'red' : ''}`} onClick={flag === "signed" ? () => handleTierClick(tier, numericPrice) : () => handleUnsignedUser(tier)} disabled={isExpired}>
                                        <div className="tier-name">{tier}</div>
                                        {selectedTier === tier && (
                                            <div className="reminder">
                                                {flag === "unsigned" ? (
                                                    isExpired ? (<div>EXPIRED</div>) : (<div>Please login First!</div>)
                                                ) : (
                                                    isExpired ? (<div>EXPIRED</div>) : (<div>click to purchase</div>)
                                                )}
                                            </div>
                                        )}
                                        <div className="tier-price">Ksh{numericPrice.toFixed(2)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="dialog-about">
                        <div className="title">About Event</div>
                        <div className="about">{event?.description}</div>
                    </div>
                </div>
                <div className="dialog-btns">
                    <Button className="tiketi-tamasha-btn" buttonText="Close" onClick={onClose} />
                </div>
            </div>
        </div>
    );
};