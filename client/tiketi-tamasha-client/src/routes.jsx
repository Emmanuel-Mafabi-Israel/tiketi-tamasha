import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Discover from "./pages/Discover";
import Explore from "./pages/Explore";

import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes({ activeSection }) {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/discover" element={<Discover />} />
			<Route path="/explore" element={<Explore />}/ >

			<Route path="/dashboard" element={<ProtectedRoute>
				<CustomerDashboard activeSection={activeSection}/>
			</ProtectedRoute>}/>
			<Route path="/organizer-dashboard" element={<ProtectedRoute>
				<OrganizerDashboard activeSection={activeSection}/>
			</ProtectedRoute>} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};