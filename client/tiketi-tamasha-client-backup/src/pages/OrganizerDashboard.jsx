/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	ORGANIZER DASHBOARD PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import LoadingPage from "../components/LoadingPage";
import Button from "../components/Button";
import NewEvent from "../components/NewEvent";
import EventCardAdmin from "../components/EventCardAdmin";
import Swal from 'sweetalert2'; // Import SweetAlert2


import doodle_background from '../assets/tamasha_doodle_background.svg';

import "../styles/Dashboard.css";
import { updateUserProfile, getUserProfile, deleteUserAccount } from "../api/userService";
import { fetchOrganizerEvents, deleteEvent } from "../api/eventService";

export default function OrganizerDashboard({ activeSection }) {
	const { user, logout } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false); // State to manage the new event dialog
	const [selectedEvent, setSelectedEvent] = useState(null); // State to hold the event being edited
	const [name, setName] = useState(user?.name || "");
	const [phone, setPhone] = useState(user?.phone_number || "");
	const navigate = useNavigate();
	const [organizerEvents, setOrganizerEvents] = useState([]);
	const [eventsError, setEventsError] = useState(null); // State for event fetching errors

	// Function to open the NewEvent dialog
	const openNewEventDialog = (event = null) => {
		setSelectedEvent(event); // Set the event being edited
		setIsNewEventDialogOpen(true);
	};

	// Function to close the NewEvent dialog
	const closeNewEventDialog = () => {
		setIsNewEventDialogOpen(false);
		setSelectedEvent(null); // Clear the selected event
	};

	const handleLogout = () => {
		setLoading(true);
		setTimeout(() => {
			logout();
			setLoading(false);
			navigate("/login");
		}, 2000);
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handlePhoneChange = (e) => {
		setPhone(e.target.value);
	};

	const handleUpdateProfile = async (field, value) => {
		const { isConfirmed } = await Swal.fire({
			title: `Update ${field}?`,
			text: `Are you sure you want to update your ${field} to ${value}?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Yes, update it!",
			cancelButtonText: "Cancel",
		});
	
		if (isConfirmed) {
			setLoading(true);
			try {
				const updatedData = {};
				updatedData[field] = value;
	
				const token = localStorage.getItem('access_token'); 
				await updateUserProfile(updatedData, token);
				const updatedUser = await getUserProfile(user.id);
	
				localStorage.setItem("user", JSON.stringify(updatedUser));
	
				await Swal.fire("Success!", `${field} updated successfully!`, "success");
				window.location.reload(); 
			} catch (error) {
				console.error("Failed to update profile:", error);
				await Swal.fire("Error", `Failed to update ${field}. Please try again.`, "error");
			} finally {
				setLoading(false);
			}
		}
	};

	const handleDeleteAccount = async () => {
		const { isConfirmed } = await Swal.fire({
			title: "Delete Account?",
			text: "Are you sure? This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});
	
		if (isConfirmed) {
			setLoading(true);
			try {
				const token = localStorage.getItem('access_token');
				await deleteUserAccount(token);
				await Swal.fire("Deleted!", "Your account has been deleted.", "success");
				logout();
				navigate("/login");
			} catch (error) {
				console.error("Failed to delete account:", error);
				await Swal.fire("Error", "Failed to delete account. Please try again.", "error");
			} finally {
				setLoading(false);
			}
		}
	};

	// Fetch Organizer Events
	useEffect(() => {
		if (activeSection === 'events') {
			setLoading(true);
			fetchOrganizerEvents()
				.then(data => {
					setOrganizerEvents(data.events);
					setEventsError(null);
				})
				.catch(error => {
					console.error("Failed to fetch organizer events:", error);
					setEventsError("Failed to load events. Please try again later.");
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [activeSection]);

	const handleDeleteEvent = async (eventId) => {
		const { isConfirmed } = await Swal.fire({
			title: "Delete Event?",
			text: "Are you sure you want to delete this event?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});
	
		if (isConfirmed) {
			setLoading(true);
			try {
				await deleteEvent(eventId);
				setOrganizerEvents(organizerEvents.filter(event => event.id !== eventId));
				await Swal.fire("Deleted!", "Event deleted successfully.", "success");
			} catch (error) {
				console.error("Failed to delete event:", error);
				await Swal.fire("Error", "Failed to delete event. Please try again.", "error");
			} finally {
				setLoading(false);
			}
		}
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
						<h1 className='tiketi-tamasha-section-heading'>Welcome, {user?.name || "Organizer"}!</h1>
						<p className='tiketi-tamasha-landing-explainer'>Create events, see the events you've created, and explore new experiences.</p>
						{/* Button to open the new event dialog */}
						<Button
							className='tiketi-tamasha-btn'
							onClick={() => openNewEventDialog(null)}
							buttonText="Create a new Event?"
						/>
					</div>
				)}
				{activeSection === 'events' && (
					<div className="events">
						<h2 className='tiketi-tamasha-section-heading'>Events</h2>
						<p className='tiketi-tamasha-page-disclaimer'>Here are the events you have created. You have the option to either edit or delete them. Additionally, you can remove any events that have <b>EXPIRED</b>.</p>
						{eventsError && <div className="error-message">{eventsError}</div>}
						<div className="container">
							{organizerEvents.map(event => (
								<EventCardAdmin
									key={event.id}
									event={event} // Pass the entire event object
									onEdit={() => openNewEventDialog(event)} // Handler for edit
									onDelete={handleDeleteEvent} // Pass the delete function
								/>
							))}
						</div>
					</div>
				)}
				{activeSection === 'settings' && (
					<div className="settings">
						<h2 className='tiketi-tamasha-section-heading'>Account Settings</h2>
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
								<div className="container-section-title">Administrative functions</div>
								<div className="container-section-action">
									<Button
										className="tiketi-tamasha-btn red"
										buttonText="Delete Account"
										alt="DeleteAccount"
										onClick={handleDeleteAccount} // Attach the handler
									/>
									<Button
										buttonText="Logout"
										alt="DeleteAccount"
										onClick={handleLogout}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
				{isNewEventDialogOpen && (
					<NewEvent onClose={closeNewEventDialog} event={selectedEvent} />
				)}
			</div>
		</div>
	);
};