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
import doodle_background from '../assets/tamasha_doodle_background.svg';
import "../styles/Dashboard.css";
import { updateUserProfile, getUserProfile, deleteUserAccount } from "../api/userService";
import { fetchOrganizerEvents, deleteEvent } from "../api/eventService";

import Swal from 'sweetalert2';

export default function OrganizerDashboard({ activeSection }) {
    const { user, logout, updateUserContext } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [name, setName] = useState(user?.name || ""); // Initialize with AuthContext user
    const [phone, setPhone] = useState(user?.phone_number || ""); // Initialize with AuthContext user
    const navigate = useNavigate();
    const [organizerEvents, setOrganizerEvents] = useState([]);
    const [eventsError, setEventsError] = useState(null);

    useEffect(() => {
        if (user) { // Check if user data is loaded from AuthContext
            setLoading(false);
            setName(user.name || "");
            setPhone(user.phone_number || "");
        } else {
            setLoading(true); // Show loading if user is not yet loaded
        }
    }, [user]);

    useEffect(() => {
        if (activeSection === 'events' && user) {
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
    }, [activeSection, user]);

	const openNewEventDialog = (event = null) => {
		setSelectedEvent(event);
		setIsNewEventDialogOpen(true);
	};

	const closeNewEventDialog = () => {
		setIsNewEventDialogOpen(false);
		setSelectedEvent(null);
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
		const shouldUpdate = await Swal.fire({
			title: 'Confirm Update',
			text: `Are you sure you want to update your ${field} to ${value}?`,
			showCancelButton: true,
			confirmButtonText: 'Yes, update!',
			cancelButtonText: 'No, cancel'
		});
		if (shouldUpdate.isConfirmed) {
			setLoading(true);
			try {
				const updatedData = {};
				if (field === "name") {
					updatedData.name = value;
				} else if (field === "phone") {
					updatedData.phone_number = value;
				}
				const token = localStorage.getItem('access_token');
				await updateUserProfile(updatedData, token);

				// Fetch updated user data and update context
				const fetchedUser = await getUserProfile();
				updateUserContext(fetchedUser); // Update AuthContext
				setName(fetchedUser.name || "");
				setPhone(fetchedUser.phone_number || "");
				await Swal.fire({
					title: 'Profile Updated',
					text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
				});
			} catch (error) {
				await Swal.fire({
					title: 'Update Failed!',
					text: `Failed to update ${field}, please try again.`
				});
				console.error("Failed to update profile:", error);
			} finally {
				setLoading(false);
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
			setLoading(true);
			try {
				const token = localStorage.getItem('access_token');
				await deleteUserAccount(token);
				await Swal.fire({
					title: 'Delete Account',
					text: 'Account deleted successfully.'
				});
				logout();
				navigate("/login");
			} catch (error) {
				await Swal.fire({
					title: 'Delete Account',
					text: 'Failed to delete account, Please try again.'
				});
				console.error("Failed to delete account:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		if (activeSection === 'events') {
			setLoading(true);
			fetchOrganizerEvents()
				.then(data => {
					console.log(data)
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
		const shouldDelete = await Swal.fire({
			title: 'Confirm Delete',
			text: 'Are you sure you want to delete this event?',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete!',
			cancelButtonText: 'No, cancel'
		});
		if (shouldDelete.isConfirmed) {
			setLoading(true);
			try {
				await deleteEvent(eventId);
				// Update the state
				setOrganizerEvents(organizerEvents.filter(event => event.id !== eventId));

				await Swal.fire({
					title: 'Event deletion',
					text: 'Event deleted successfully'
				});
			} catch (error) {
				await Swal.fire({
					title: 'Event deletion',
					text: 'Failed to delete event, Please try again.'
				});
				console.error("Failed to delete event:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	if (!user) { // Prevent rendering until user data is loaded
		return null;
	}

	return (
		<>
			{loading && <LoadingPage />}
			<div className="tiketi-tamasha-dashboard">
				<img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
				<div className="tiketi-tamasha-section">
					{activeSection === 'home' && (
						<div className="home">
							<h1 className='tiketi-tamasha-section-heading'>Welcome, {user?.name || "Organizer"}!</h1>
							<p className='tiketi-tamasha-landing-explainer'>Create events, see the events you've created, and explore new experiences.</p>
							<Button className='tiketi-tamasha-btn' onClick={() => openNewEventDialog(null)} buttonText="Create a new Event?" />
						</div>
					)}
					{activeSection === 'events' && (
						<div className="events">
							<h2 className='tiketi-tamasha-section-heading'>Events</h2>
							<p className='tiketi-tamasha-page-disclaimer'>Here are the events you have created. You have the option to either edit or delete them. Additionally, you can remove any events that have <b>EXPIRED</b>.</p>
							{eventsError && <div className="error-message">{eventsError}</div>}
							<div className="container">
								{organizerEvents.map(event => (
									<EventCardAdmin key={event.id} event={event} onEdit={() => openNewEventDialog(event)} onDelete={handleDeleteEvent} />
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
										<input type="text" name="name" className="tiketi-tamasha-input" placeholder="Change Your Name" value={name} onChange={handleNameChange} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateProfile('name', name); } }} required />
										<input type="tel" name="phone" className="tiketi-tamasha-input" placeholder="Change Your Phone Number" value={phone} onChange={handlePhoneChange} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateProfile('phone', phone); } }} required />
									</div>
								</div>
								<div className="container-section">
									<div className="container-section-title">Administrative functions</div>
									<div className="container-section-action">
										<Button className="tiketi-tamasha-btn red" buttonText="Delete Account" alt="DeleteAccount" onClick={handleDeleteAccount} />
										<Button buttonText="Logout" alt="DeleteAccount" onClick={handleLogout} />
									</div>
								</div>
							</div>
						</div>
					)}
					{isNewEventDialogOpen && <NewEvent onClose={closeNewEventDialog} event={selectedEvent} />}
				</div>
			</div>
		</>
	);
};