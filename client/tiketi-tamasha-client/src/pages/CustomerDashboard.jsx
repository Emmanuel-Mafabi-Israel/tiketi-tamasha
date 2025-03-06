/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    CUSTOMER DASHBOARD PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
//import { useLoading } from "../context/LoadingContext"; // REMOVE LoadingContext import

import TicketCard from "../components/TicketCard";
import PaymentCard from "../components/PaymentCard";
import LoadingPage from "../components/LoadingPage";
import Button from "../components/Button";

import doodle_background from '../assets/tamasha_doodle_background.svg';
import tiketi_event from '../assets/tiketi-tamasha-event.svg';
import "../styles/Dashboard.css";
import { updateUserProfile, getUserProfile, deleteUserAccount } from "../api/userService";
import { queryPaymentStatus } from "../api/paymentService";

import Swal from "sweetalert2";

export default function CustomerDashboard({ activeSection }) {
    const { user, payments, tickets, myEvents, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false); // Local loading state
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone_number || "");
    const navigate = useNavigate();

    const { refreshUserData } = useContext(AuthContext);

    useEffect(() => {
        refreshUserData();
    }, [refreshUserData]);

    const handleLogout = () => {
        setLoading(true); // Trigger the spinner
        setTimeout(() => {
            logout(); // Logout user
            navigate("/login"); // Redirect to login page
            setLoading(false); // Stop spinner
        }, 2000);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleUpdateProfile = async (field, value) => {
        const shouldUpdate = await Swal.fire({
            title: 'Confirm Update',
            text: `Are you sure you want to update your ${field} to ${value}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, update!',
            cancelButtonText: 'No, cancel'
        });
        if (shouldUpdate.isConfirmed) {
            setLoading(true); // Trigger spinner during profile update
            try {
                const updatedData = {};
                if (field === "name") {
                    updatedData.name = value;
                } else if (field === "phone") {
                    updatedData.phone_number = value;
                }
                const token = localStorage.getItem('access_token'); // Retrieve token
                await updateUserProfile(updatedData, token); // Update user profile
                // After successful update, fetch and store updated user profile
                const updatedUser = await getUserProfile(user.id);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                const ok_pressed = await Swal.fire({
                    title: 'Profile Updated',
                    text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
                });
                if (ok_pressed.isConfirmed) {
                    window.location.reload();
                }
                window.location.reload();
            } catch (error) {
                const ok_pressed = await Swal.fire({
                    title: 'Update Failed!',
                    text: `Failed to update ${field}, please try again.`
                });
                if (ok_pressed.isConfirmed) {
                    window.location.reload();
                }
                window.location.reload();
                console.error("Failed to update profile:", error);
            } finally {
                setLoading(false); // Stop spinner
            }
        }
    };

    const handleDeleteAccount = async () => {
        const shouldDelete = await Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete your account? This action cannot be undone.',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No, cancel'
        });
        if (shouldDelete.isConfirmed) {
            setLoading(true); // Trigger spinner for account deletion
            try {
                const token = localStorage.getItem('access_token');
                await deleteUserAccount(token);
                const ok_pressed = await Swal.fire({
                    title: 'Delete Account',
                    text: 'Account deleted successfully.'
                });
                if (ok_pressed.isConfirmed) {
                    logout();
                    navigate("/login");
                }
                logout();
                navigate("/login");
            } catch (error) {
                const ok_pressed = await Swal.fire({
                    title: 'Delete Account',
                    text: 'Failed to delete account, Please try again.'
                });
                if (ok_pressed.isConfirmed) {
                    window.location.reload();
                }
                window.location.reload();
                console.error("Failed to delete account:", error);
            } finally {
                setLoading(false); // Stop spinner
            }
        }
    };

    const handleQueryPaymentStatus = async (checkoutRequestId, token) => {
        try {
            setLoading(true);
            const response = await queryPaymentStatus(checkoutRequestId, token);
            return response;
        } catch (error) {
            console.error("Error querying payment status:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // for interactivity sake
    const categories = ["Conserve", "Finance", "Fitness", "Music", "Research", "Wellness"]
    const getRandomCategory = () => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        // like each and every time we do a click a random category is selected...
        return categories[randomIndex];
    };

    const handleSearchClick = () => {
        const randomCategory = getRandomCategory();
        navigate(`/explore?q=${randomCategory}`);
    }

    if (loading) {
        return (
            <>
                <LoadingPage />
                <div className="tiketi-tamasha-dashboard">
                    <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
                </div>
            </>
        );
    }

    return (
        <div className="tiketi-tamasha-dashboard">
            <img className="tiketi-tamasha-doodle-background" src={doodle_background} alt="tamasha-doodle" />
            <div className="tiketi-tamasha-section">
                {activeSection === 'home' && (
                    <div className="home">
                        <h1 className="tiketi-tamasha-section-heading">Welcome, {user?.name || "Guest"}!</h1>
                        <p className="tiketi-tamasha-landing-explainer">Discover events, see your tickets, and explore new experiences.</p>
                        <button className="tiketi-tamasha-btn" onClick={handleSearchClick}>Search for Events?</button>
                    </div>
                )}
                {activeSection === 'tickets' && (
                    <div className="tickets">
                        <h2 className="tiketi-tamasha-section-heading">Tickets</h2>
                        <div className="container">
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                <TicketCard
                                    key={ticket.id}
                                    ticketTitle={ticket.event_title}
                                    ticketType={ticket.ticket_type}
                                    ticketTime={ticket.purchase_date}
                                />
                            ))) : (
                                <p className="results-empty">You have no Tickets</p>
                            )}
                        </div>
                    </div>
                )}
                {activeSection === 'upcoming' && (
                    <div className="upcoming">
                        <h2 className="tiketi-tamasha-section-heading">My Events</h2>
                        <div className="container">
                            {myEvents.length > 0 ? (
                                myEvents.map(event => (
                                    <TicketCard
                                        key={`${user?.id}-${event.id}`}
                                        card_image={tiketi_event}
                                        ticketTitle={event.title}
                                        ticketType={event.start_date}
                                        ticketTime={event.location}
                                        {...console.log(event)}
                                    />
                                ))
                            ) : (
                                <p className="results-empty">You have no Events</p>
                            )}
                        </div>
                    </div>
                )}
                {activeSection === 'payments' && (
                    <div className="payments">
                        <h2 className="tiketi-tamasha-section-heading">Payments</h2>
                        <div className="container">
                            {payments.length > 0 ? (payments.map(payment => (
                                <PaymentCard
                                    key={payment.id}
                                    paymentTitle={payment.event_title}
                                    paymentStatus={payment.status}
                                    paymentMethod={payment.payment_method}
                                    transactionID={payment.transaction_id}
                                    paymentTime={payment.payment_date}
                                    amount={payment.amount}
                                    checkoutRequestId={payment.transaction_id} // Pass checkout_request_id -> same as transaction ID
                                    token={localStorage.getItem("access_token")} // Pass token
                                    onClick={handleQueryPaymentStatus} // Pass handler
                                />
                            ))) : (
                                <p className="results-empty">You haven't made any payments yet</p>
                            )}
                        </div>
                    </div>
                )}
                {activeSection === 'settings' && (
                    <div className="settings">
                        <h2 className="tiketi-tamasha-section-heading">Account Settings</h2>
                        <div className="tiketi-tamasha-settings-disclaimer">
                            To apply your changes, press the <b>ENTER</b> key in the field you’re working on. For example, after entering your new username in the 'Change Your Name' field, press Enter to save it.
                        </div>
                        <div className="container">
                            <div className="container-section">
                                <div className="container-section-title">Profile Settings</div>
                                <div className="container-section-action">
                                    <input
                                        type="text"
                                        name="name"
                                        className="tiketi-tamasha-input"
                                        placeholder="Change Your Name"
                                        value={name}
                                        onChange={handleNameChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault(); // Prevent form submission
                                                handleUpdateProfile('name', name);
                                            }
                                        }}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="tiketi-tamasha-input"
                                        placeholder="Change Your Phone Number"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault(); // Prevent form submission
                                                handleUpdateProfile('phone', phone);
                                            }
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="container-section">
                                <div className="container-section-title">Administrative Functions</div>
                                <div className="container-section-action">
                                    <Button
                                        className="tiketi-tamasha-btn red"
                                        buttonText="Delete Account"
                                        alt="DeleteAccount"
                                        onClick={handleDeleteAccount} // Attach handler
                                    />
                                    <Button
                                        buttonText="Logout"
                                        alt="LogoutAccount"
                                        onClick={handleLogout} // Attach handler
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};