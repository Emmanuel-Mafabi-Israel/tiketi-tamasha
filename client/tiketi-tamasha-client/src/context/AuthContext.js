import React, { createContext, useState, useEffect, useCallback } from "react";
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
        const storedToken = localStorage.getItem("access_token");
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
                setUser(userDetails);
                // if(userDetails.role === 'organizer') {
                //     // organizer login...
                //     // an organizer has no ability in purchasing tickets
                //     // their sole purpose is for event creation and ticket selling...
                //     // so for the organizer, what we are interested in is...
                //     // the events, they've created and so, consumer's interested in the events they are hosting and so on...
                //     console.log("Welcome Organizer!");
                //     const organizerEvents = await fetchUserDetails()
                // }
                const userPayments = await fetchPayments(response.access_token);
                const userTickets = await fetchTickets(response.access_token);
                const userEvents = await fetchMyEvents(response.access_token);

                setPayments(userPayments);
                setTickets(userTickets);
                setMyEvents(userEvents);

                localStorage.setItem("user", JSON.stringify(userDetails));
                localStorage.setItem("payments", JSON.stringify(userPayments));
                localStorage.setItem("tickets", JSON.stringify(userTickets));
                localStorage.setItem("myEvents", JSON.stringify(userEvents));
                localStorage.setItem("access_token", response.access_token);
                navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
            } else {
                console.error("Login successful but no access token received.");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const register = async (userData, navigate) => {
        try {
            console.log("Registering user with data:", userData);
            const response = await registerUser(userData);
            console.log("Register response:", response);
            if (response && response.success) {
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
                localStorage.setItem("access_token", response.access_token);

                navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
            } else {
                console.error("Registration not successful");
            }
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw error;
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
        localStorage.removeItem("access_token");
    };

    const refreshUserData = useCallback(async () => {
        console.log("Refresh User Data is being called here...");
        const accessToken = localStorage.getItem("access_token");
        console.log(`access_token: ${accessToken}`);
        if (accessToken) {
            try {
                const userPayments = await fetchPayments(accessToken);
                const userTickets = await fetchTickets(accessToken);
                const userEvents = await fetchMyEvents(accessToken);

                setPayments(userPayments);
                setTickets(userTickets);
                setMyEvents(userEvents);

                console.log(userPayments);

                localStorage.setItem("payments", JSON.stringify(userPayments));
                localStorage.setItem("tickets", JSON.stringify(userTickets));
                localStorage.setItem("myEvents", JSON.stringify(userEvents));
            } catch (error) {
                console.error("Error refreshing user data:", error);
            }
        } else {
            console.log("Access token not found in localStorage.");
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, payments, tickets, myEvents, login, register, logout, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
};