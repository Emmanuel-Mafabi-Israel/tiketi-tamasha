/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	CUSTOMER DASHBOARD PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import TicketCard from "../components/TicketCard";
import PaymentCard from "../components/PaymentCard";
import LoadingPage from "../components/LoadingPage";

import doodle_background from '../assets/tamasha_doodle_background.svg';
import tiketi_event from '../assets/tiketi-tamasha-event.svg';
import "../styles/Dashboard.css";

export default function CustomerDashboard({ activeSection }) {
	const { user, payments, tickets, myEvents, logout } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogout = () => {
		setLoading(true);
		setTimeout(() => {
			logout();
			setLoading(false);
			navigate("/login");
		}, 2000);
	};

    if (loading) {
        return (
            <>
                <LoadingPage />
                <div className="tiketi-tamasha-auth-page">
                    <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
                </div>
            </>
        );
    }

	return (
		<div className="tiketi-tamasha-dashboard">
			<img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
			<div className="tiketi-tamasha-section">
				{activeSection === 'home' && (
					<div className="home">
						<h1 className='tiketi-tamasha-section-heading'>Welcome, {user?.name || "Guest"}!</h1>
						<p className='tiketi-tamasha-landing-explainer'>Discover events, see your tickets, and explore new experiences.</p>
						<button className='tiketi-tamasha-btn' onClick={() => navigate("/register")}>Search for Events?</button>
					</div>
				)}
				{activeSection === 'tickets' && (
					<div className="tickets">
						<h2 className='tiketi-tamasha-section-heading'>Tickets</h2>
						<div className="container">
							{tickets.map(ticket => (
								<TicketCard
									key={ticket.id}
									ticketTitle={ticket.event_title}
									ticketType={ticket.ticket_type}
									ticketTime={ticket.purchase_date}
								/>
							))}
						</div>
					</div>
				)}
				{activeSection === 'upcoming' && (
					<div className="upcoming">
						<h2 className="tiketi-tamasha-section-heading">My Events</h2>
						<div className="container">
							{myEvents.map(event => (
								<TicketCard
									key={event.id}
									card_image={tiketi_event}
									ticketTitle={event.title}
									ticketType={event.start_date}
									ticketTime={event.location}
								/>
							))}
						</div>
					</div>
				)}
				{activeSection === 'payments' && (
					<div className="payments">
						<h2 className='tiketi-tamasha-section-heading'>Payments</h2>
						<div className="container">
							{payments.map(payment => (
								<PaymentCard
									key={payment.id}
									paymentTitle={payment.event_title}
									paymentStatus={payment.status}
									paymentMethod={payment.payment_method}
									transactionID={payment.transaction_id}
									paymentTime={payment.payment_date}
									amount={payment.amount}
								/>
							))}
						</div>
					</div>
				)}
				{activeSection === 'settings' && (
					<div className="settings">
						<h2>Settings Section</h2>
						<button className='tiketi-tamasha-btn logout' onClick={handleLogout}>Logout</button>
					</div>
				)}
			</div>
		</div>
	);
};