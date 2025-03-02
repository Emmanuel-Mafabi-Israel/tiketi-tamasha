import React, { createContext, useState, useEffect } from "react";
import { loginUser, fetchUserDetails, registerUser, logoutUser } from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser);
		}
	}, []);

	const login = async (credentials, navigate) => {
		const response = await loginUser(credentials);
		// console.log(response);
		if (response.access_token) {
			const userDetails = await fetchUserDetails(response.access_token);
			// console.log(userDetails);
			setUser(userDetails);
			localStorage.setItem("user", JSON.stringify(userDetails));
			navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
			console.log(userDetails.role);
		}
	};

	const register = async (userData, navigate) => {
		const response = await registerUser(userData);
		if (response.access_token) {
			const userDetails = await fetchUserDetails(response.access_token);
			setUser(userDetails);
			localStorage.setItem("user", JSON.stringify(userDetails));
			navigate(userDetails.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
		}
	};

	const logout = () => {
		logoutUser();
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};