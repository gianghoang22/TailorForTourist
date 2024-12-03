import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./ProfileNav.scss";
import {
  FaHome,
  FaUser,
  FaRuler,
  FaShoppingBag,
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa";

const ProfileNav = () => {
  const location = useLocation();
  const activeLink = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="profile-nav">
      <ul>
        <li>
          <Link to="/" className={activeLink("/")}>
            <FaHome className="nav-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/profile" className={activeLink("/profile")}>
            <FaUser className="nav-icon" /> Profile
          </Link>
        </li>
        <li>
          <Link
            to="/profile/measurement"
            className={activeLink("/profile/measurement")}
          >
            <FaRuler className="nav-icon" /> Measurement
          </Link>
        </li>
        <li>
          <Link
            to="/profile/order-history"
            className={activeLink("/profile/order-history")}
          >
            <FaShoppingBag className="nav-icon" /> Orders
          </Link>
        </li>
        <li>
          <Link
            to="/profile/appointment"
            className={activeLink("/profile/appointment")}
          >
            <FaCalendarAlt className="nav-icon" /> Appointments
          </Link>
        </li>
        <li>
          <Link
            to="/profile/feedback"
            className={activeLink("/profile/feedback")}
          >
            <FaComments className="nav-icon" /> Feedback
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNav;
