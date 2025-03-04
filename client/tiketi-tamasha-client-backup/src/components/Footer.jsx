import React from "react";
import "../styles/Footer.css";

export default function Footer() {
	return (
		<footer className="tiketi-tamasha-footer">
			<p>&copy; {new Date().getFullYear()} Tiketi<b>Tamasha</b>&nbsp;by Tamasha Dev</p>
		</footer>
	);
};