import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="text-xl font-bold">Tiketi Tamasha</Link>
      <div>
        <Link to="/events" className="mx-4">Explore Events</Link>
        <Link to="/dashboard" className="mx-4">Dashboard</Link>
        <Link to="/profile" className="mx-4">Profile</Link>
        <Link to="/login" className="mx-4">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
