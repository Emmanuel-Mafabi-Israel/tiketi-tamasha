/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	ORGANIZER DASHBOARD PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	ORGANIZER DASHBOARD PAGE,

	BY ISRAEL MAFABI EMMANUEL
*/

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import PaymentCard from "../components/PaymentCard";
import LoadingPage from "../components/LoadingPage";
import Button from "../components/Button";
import NewEvent from "../components/NewEvent";

import doodle_background from '../assets/tamasha_doodle_background.svg';
// import tiketi_event from '../assets/tiketi-tamasha-event.svg';
import "../styles/Dashboard.css";
import { updateUserProfile, getUserProfile, deleteUserAccount } from "../api/userService";

export default function OrganizerDashboard({ activeSection }) {
	const { user, payments, logout } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false); // State to manage the new event dialog
	const [name, setName] = useState(user?.name || "");
	const [phone, setPhone] = useState(user?.phone_number || "");
	const navigate = useNavigate();

    // Function to open the NewEvent dialog
    const openNewEventDialog = () => {
        setIsNewEventDialogOpen(true);
    };

    // Function to close the NewEvent dialog
    const closeNewEventDialog = () => {
        setIsNewEventDialogOpen(false);
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
		const shouldUpdate = window.confirm(`Are you sure you want to update your ${field} to ${value}?`);

		if (shouldUpdate) {
			setLoading(true);
			try {
				const updatedData = {};
				if (field === "name") {
					updatedData.name = value;
				} else if (field === "phone") {
					updatedData.phone_number = value;
				}
				// console.log(updatedData);
				const token = localStorage.getItem('access_token'); // Retrieve the stored token
				await updateUserProfile(updatedData, token); // Pass the token

				// After successful update, fetch the updated user profile
				const updatedUser = await getUserProfile(user.id);

				// Update the user context with the new user data
				localStorage.setItem("user", JSON.stringify(updatedUser));
				alert(`${field} updated successfully!`);

				// Log the updated user data

				// Update the user context
				// await login({email: updatedUser.email, password: })
				window.location.reload(); //refresh the page in order to see the updated details
			} catch (error) {
				console.error("Failed to update profile:", error);
				alert(`Failed to update ${field}. Please try again.`);
			} finally {
				setLoading(false);
			}
		}
	};

	const handleDeleteAccount = async () => {
		const shouldDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

		if (shouldDelete) {
			setLoading(true);
			try {
				const token = localStorage.getItem('access_token');
				await deleteUserAccount(token);
				alert("Account deleted successfully.");
				logout(); // Log the user out
				navigate("/login"); // Redirect to login page
			} catch (error) {
				console.error("Failed to delete account:", error);
				alert("Failed to delete account. Please try again.");
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
                            onClick={openNewEventDialog}
                            buttonText="Create a new Event?"
                        />
                        {/* Render the NewEvent dialog if isNewEventDialogOpen is true */}
                        {isNewEventDialogOpen && (
                            <NewEvent onClose={closeNewEventDialog} />
                        )}
					</div>
				)}
				{activeSection === 'events' && (
					<div className="payments">
						<h2 className='tiketi-tamasha-section-heading'>Events</h2>
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
									{/* <button className='tiketi-tamasha-btn logout' onClick={handleLogout}>Logout</button> */}
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
			</div>
		</div>
	);
};