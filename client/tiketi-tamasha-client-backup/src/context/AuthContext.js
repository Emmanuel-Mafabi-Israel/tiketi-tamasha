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
        const storedToken = localStorage.getItem("access_token")
        if (storedUser && storedToken) {
            setUser(storedUser);
            setPayments(JSON.parse(localStorage.getItem("payments")) || []);
            setTickets(JSON.parse(localStorage.getItem("tickets")) || []);
            setMyEvents(JSON.parse(localStorage.getItem("myEvents")) || []);
        }
    }, []);

    const login = async (credentials, navigate) => {
        try {
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
                localStorage.setItem("access_token", response.access_token); // STORE THE TOKEN
                navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
            } else {
                // Handle the case where login was "successful" (no error thrown) but no token was returned.
                console.error("Login successful but no access token received.");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }

    };

    const register = async (userData, navigate) => {
        try {
            console.log("Registering user with data:", userData);  // Log the data being sent
            const response = await registerUser(userData);
            console.log("Register response:", response); // Log the full response

            if (response && response.success) { // Ensure response and success is true
                // Registration Successful then log the data..
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
                localStorage.setItem("access_token", response.access_token); // STORE THE TOKEN

                navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
            } else {
                // Registration was technically "successful" (no error thrown) but no token was returned.
                console.error("Registration not successful");
                // Optionally, set an error state here to inform the user.
            }
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            // Handle the registration failure (e.g., show an error message)
            throw error; // Re-throw the error so the Register component can handle it.
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
        localStorage.removeItem("access_token"); // REMOVE THE TOKEN on logout
    };

    return (
        <AuthContext.Provider value={{ user, payments, tickets, myEvents, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};