/*
	GLORY BE TO GOD,
	TIKETI TAMASHA,
	BY TAMASHA DEV,

	ISRAEL MAFABI EMMANUEL
	-> STARTING PAGE...
*/

import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";

export default function App() {
	const [activeSection, setActiveSection] = useState('home');

	return (
		<AuthProvider>
			<LoadingProvider>
				<Router>
					<div className="tiketi-tamasha-container">
						<Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
						<AppRoutes activeSection={activeSection} />
						<Footer />
					</div>
				</Router>
			</LoadingProvider>
		</AuthProvider>
	);
};