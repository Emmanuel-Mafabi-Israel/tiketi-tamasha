import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ManageEvents from "./pages/ManageEvents";
import CreateEvent from "./pages/CreateEvent";
import Purchase from "./pages/Purchase";
import Confirmation from "./pages/Confirmation";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/events" element={<Events />} />
			<Route path="/events/:id" element={<EventDetails />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* Protected Routes */}
			<Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
			<Route path="/organizer-dashboard" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
			<Route path="/manage-events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
			<Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
			<Route path="/purchase" element={<ProtectedRoute><Purchase /></ProtectedRoute>} />
			<Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
			<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};