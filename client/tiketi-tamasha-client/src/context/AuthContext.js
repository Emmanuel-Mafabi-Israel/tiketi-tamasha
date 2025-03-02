import React, { createContext, useState, useEffect } from "react";
import { loginUser, fetchUserDetails, registerUser, logoutUser } from "../api/authService";
import { fetchPayments } from "../api/paymentService";
import { fetchTickets } from "../api/ticketService";
import { fetchMyEvents } from "../api/myEventService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [payments, setPayments] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [myEvents, setMyEvents] = useState([]);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser);
			setPayments(JSON.parse(localStorage.getItem("payments")) || []);
			setTickets(JSON.parse(localStorage.getItem("tickets")) || []);
			setMyEvents(JSON.parse(localStorage.getItem("myEvents")) || []);
		}
	}, []);

	const login = async (credentials, navigate) => {
		const response = await loginUser(credentials);
		if (response.access_token) {
			const userDetails = await fetchUserDetails(response.access_token);
			const userPayments = await fetchPayments(response.access_token);
			const userTickets = await fetchTickets(response.access_token);
			const userEvents = await fetchMyEvents(response.access_token);

			setUser(userDetails);
			setPayments(userPayments);
			setTickets(userTickets);
			setMyEvents(userEvents);

			localStorage.setItem("user", JSON.stringify(userDetails));
			localStorage.setItem("payments", JSON.stringify(userPayments));
			localStorage.setItem("tickets", JSON.stringify(userTickets));
			localStorage.setItem("myEvents", JSON.stringify(userEvents));

			navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
		}
	};

	const register = async (userData, navigate) => {
		const response = await registerUser(userData);
		if (response.access_token) {
			const userDetails = await fetchUserDetails(response.access_token);
			const userPayments = await fetchPayments(response.access_token);
			const userTickets = await fetchTickets(response.access_token);
			const userEvents = await fetchMyEvents(response.access_token);

			setUser(userDetails);
			setPayments(userPayments);
			setTickets(userTickets);
			setMyEvents(userEvents);

			localStorage.setItem("user", JSON.stringify(userDetails));
			localStorage.setItem("payments", JSON.stringify(userPayments));
			localStorage.setItem("tickets", JSON.stringify(userTickets));
			localStorage.setItem("myEvents", JSON.stringify(userEvents));

			navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
		}
	};

	const logout = () => {
		logoutUser();
		setUser(null);
		setPayments([]);
		setTickets([]);
		setMyEvents([]);
		localStorage.removeItem("user");
		localStorage.removeItem("payments");
		localStorage.removeItem("tickets");
		localStorage.removeItem("myEvents");
	};

	return (
		<AuthContext.Provider value={{ user, payments, tickets, myEvents, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
