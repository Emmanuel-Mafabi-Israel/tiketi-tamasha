import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser, logoutUser } from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Function to check token validity
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Convert expiry to milliseconds
    } catch (error) {
      return false; // Invalid token
    }
  };

  // ✅ Load user from localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isTokenValid(token)) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.sub, role: decoded.role, token });
    } else {
      logout();
    }
  }, []);

  // ✅ Login function
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);

      if (response && response.access_token) {
        localStorage.setItem("token", response.access_token);
        const decoded = jwtDecode(response.access_token);

        setUser({ id: decoded.id, email: decoded.sub, role: decoded.role, token: response.access_token });

        return decoded.role;
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw new Error("Invalid email or password.");
    }
  };

  // ✅ Register function
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      if (response && response.access_token) {
        localStorage.setItem("token", response.access_token);
        const decoded = jwtDecode(response.access_token);

        setUser({ id: decoded.id, email: decoded.sub, role: decoded.role, token: response.access_token });

        return decoded.role;
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (error) {
      console.error("❌ Registration failed:", error);
      throw new Error("Registration failed.");
    }
  };

  // ✅ Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
