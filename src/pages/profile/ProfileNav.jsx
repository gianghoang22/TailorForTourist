import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./ProfileNav.scss"; // Optional: Add your own styles
import { FaUser, FaRuler, FaShoppingBag, FaLock, FaHome } from "react-icons/fa";

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
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/profile" className={activeLink("/profile")}>
            <FaUser /> Profile
          </Link>
        </li>
        <li>
          <Link
            to="/profile/measurement"
            className={activeLink("/profile/measurement")}
          >
            <FaRuler /> Measurement
          </Link>
        </li>
        <li>
          <Link
            to="/profile/order-history"
            className={activeLink("/profile/order-history")}
          >
            <FaShoppingBag /> Orders
          </Link>
        </li>
        <li>
          <Link
            to="/profile/appointment"
            className={activeLink("/profile/appointment")}
          >
            <FaShoppingBag /> Appointments
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNav;
