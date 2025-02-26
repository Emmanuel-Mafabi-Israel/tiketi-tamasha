/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	BY TAMASHA DEV,

	ISRAEL MAFABI EMMANUEL
	-> STARTING PAGE...
*/

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="tiketi-tamasha-container">
					<Navbar />
					<AppRoutes />
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	);
};