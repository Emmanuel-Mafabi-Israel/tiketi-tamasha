/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	CUSTOMER DASHBOARD PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

import TicketCard from "../components/TicketCard";
import PaymentCard from "../components/PaymentCard";
import LoadingPage from "../components/LoadingPage";
import Button from "../components/Button";

import doodle_background from '../assets/tamasha_doodle_background.svg';
import tiketi_event from '../assets/tiketi-tamasha-event.svg';
import "../styles/Dashboard.css";
import { updateUserProfile, getUserProfile, deleteUserAccount } from "../api/userService";

export default function CustomerDashboard({ activeSection }) {
    const { user, payments, tickets, myEvents, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone_number || "");
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            logout();
            setLoading(false);
            navigate("/login");
        }, 2000);
    };

    const handleUpdateProfile = async (field, value) => {
        const { isConfirmed } = await Swal.fire({
            title: `Update ${field}?`,
            text: `Are you sure you want to change your ${field} to "${value}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "No, cancel",
        });

        if (isConfirmed) {
            setLoading(true);
            try {
                const updatedData = {};
                if (field === "name") {
                    updatedData.name = value;
                } else if (field === "phone") {
                    updatedData.phone_number = value;
                }

                const token = localStorage.getItem("access_token"); // Retrieve stored token
                await updateUserProfile(updatedData, token); // Pass token

                // Fetch updated user profile
                const updatedUser = await getUserProfile(user.id);
                localStorage.setItem("user", JSON.stringify(updatedUser));

                await Swal.fire({
                    title: "Success!",
                    text: `${field} updated successfully!`,
                    icon: "success",
                });

                window.location.reload(); // Refresh to apply changes
            } catch (error) {
                console.error("Failed to update profile:", error);
                Swal.fire({
                    title: "Error",
                    text: `Failed to update ${field}. Please try again.`,
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteAccount = async () => {
        const { isConfirmed } = await Swal.fire({
            title: "Delete Account?",
            text: "Are you sure you want to delete your account? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        });

        if (isConfirmed) {
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                await deleteUserAccount(token);

                await Swal.fire({
                    title: "Deleted!",
                    text: "Your account has been deleted successfully.",
                    icon: "success",
                });

                logout();
                navigate("/login");
            } catch (error) {
                console.error("Failed to delete account:", error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete account. Please try again.",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <>
                <LoadingPage />
                <div className="tiketi-tamasha-dashboard">
                    <img className="tiketi-tamasha-doodle-background" src={doodle_background} alt="tamasha-doodle" />
                </div>
            </>
        );
    }

    return (
        <div className="tiketi-tamasha-dashboard">
            <img className="tiketi-tamasha-doodle-background" src={doodle_background} alt="tamasha-doodle" />
            <div className="tiketi-tamasha-section">
                {activeSection === "home" && (
                    <div className="home">
                        <h1 className="tiketi-tamasha-section-heading">Welcome, {user?.name || "Guest"}!</h1>
                        <p className="tiketi-tamasha-landing-explainer">Discover events, see your tickets, and explore new experiences.</p>
                        <button className="tiketi-tamasha-btn" onClick={() => navigate("/register")}>
                            Search for Events?
                        </button>
                    </div>
                )}
                {activeSection === "tickets" && (
                    <div className="tickets">
                        <h2 className="tiketi-tamasha-section-heading">Tickets</h2>
                        <div className="container">
                            {tickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticketTitle={ticket.event_title} ticketType={ticket.ticket_type} ticketTime={ticket.purchase_date} />
                            ))}
                        </div>
                    </div>
                )}
                {activeSection === "settings" && (
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
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleUpdateProfile("name", name);
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
                                        onChange={(e) => setPhone(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleUpdateProfile("phone", phone);
                                            }
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="container-section">
                                <div className="container-section-title">Administrative Functions</div>
                                <div className="container-section-action">
                                    <Button className="tiketi-tamasha-btn red" buttonText="Delete Account" alt="DeleteAccount" onClick={handleDeleteAccount} />
                                    <Button buttonText="Logout" alt="Logout" onClick={handleLogout} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
