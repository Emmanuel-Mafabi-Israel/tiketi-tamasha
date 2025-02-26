import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser } from "../api/authService";

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
		if (response.token) {
			setUser(response.user);
			localStorage.setItem("user", JSON.stringify(response.user));
			navigate(response.user.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
		}
	};

	const register = async (userData, navigate) => {
		const response = await registerUser(userData);
		if (response.token) {
			setUser(response.user);
			localStorage.setItem("user", JSON.stringify(response.user));
			navigate(response.user.role === "organizer" ? "/organizer-dashboard" : "/dashboard");
		}
	};

	// ✅ Define logout function properly
	const logout = () => {
		logoutUser(); // Call the function from `authService.js`
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
