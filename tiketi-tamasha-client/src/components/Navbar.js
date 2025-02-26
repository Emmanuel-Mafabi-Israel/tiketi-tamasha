import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaExternalLinkAlt } from "react-icons/fa";
import "../styles/Navbar.css";
import logoIcon from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg"; // ✅ Import the logo

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return ( 
    <nav className="navbar">
      {/* ✅ Updated logo section */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logoIcon} alt="Tiketi Tamasha Logo" />
        <div className="logo-text">
          <span className="logo-light">Tiketi</span>
          <span className="logo-bold">Tamasha</span>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/events" className="explore-link">
            Explore Events 
            <FaExternalLinkAlt className="explore-icon" />
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to={user.role === "organizer" ? "/organizer-dashboard" : "/dashboard"}>
                Dashboard
              </Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="auth-btn">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
