import React from "react";
import "../navigation/Navigation.scss"; // Adjust the path as necessary
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./../../../assets/img/icon/matcha.png"; // Adjust the path as necessary
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa"; // Import icons

export const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/signin");
  };

  const userID = localStorage.getItem("userID");
  const roleID = localStorage.getItem("roleID"); // Get the roleID from localStorage
  const isLoggedIn = !!userID; // Check if userID exists in localStorage

  console.log("Current roleID:", roleID); // Debugging line to check roleID

  return (
    <header className="header-area header_area">
      <div className="main-header header-sticky">
        <div className="container-header d-flex justify-content-between align-items-center">
          <div className="logo">
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "160px", height: "auto" }}
              />{" "}
              {/* Adjust the width as needed */}
            </a>
          </div>
          <nav className="main-menu d-none d-lg-block">
            <div className="main-menu f-right d-none d-lg-block">
              <ul id="navigation" className="d-flex justify-content-between">
                <li>
                  <a href="#">SUITS</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/custom-suits">DESIGN YOUR SUITS</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">COLLECTIONS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">BLAZERS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">BLAZERS COLLECTION</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">SHIRTS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">SHIRTS COLLECTIONS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">PANTS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">PANTS COLLECTIONS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">COAT</a>
                </li>
                <li>
                  <a href="#">WOMEN</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">SUITS</a>
                    </li>
                    <li>
                      <a href="#">PANTS</a>
                    </li>
                    <li>
                      <a href="#">BLAZERS</a>
                    </li>
                    <li>
                      <a href="#">DRESS</a>
                    </li>
                    <li>
                      <a href="#">SKIRT</a>
                    </li>
                    <li>
                      <a href="#">TOP & BLOUSE</a>
                    </li>
                    <li>
                      <a href="#">OVERCOAT</a>
                    </li>
                    <li>
                      <a href="#">BUSINESS DRESS</a>
                    </li>
                    <li>
                      <a href="#">BUSINESS SHIRTS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">WEDDING</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">GROOM</a>
                    </li>
                    <li>
                      <a href="#">BRIDESMAID</a>
                    </li>
                    <li>
                      <a href="#">BRIDE</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">ACCESSORIES</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">TIES</a>
                    </li>
                    <li>
                      <a href="#">BOW TIES</a>
                    </li>
                    <li>
                      <a href="#">MASKS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/contact-us">CONTACT</Link>
                </li>
                <li>
                  <Link to="/cart">CART</Link>
                </li>
                {isLoggedIn && roleID === "customer" && (
                  <li>
                    <Link to="/profile">PROFILE</Link>
                  </li>
                )}
                {/* Render Booking button for all users, but restrict access in logic */}
                {(isLoggedIn && roleID === "customer") || !isLoggedIn ? (
                  <li>
                    <Link to="/booking" className="booking-btn">
                      <FaCalendarAlt /> BOOKING
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </nav>
          <div className="header-right-btn d-none d-lg-block ml-30">
            {isLoggedIn ? (
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <Link to="/signin" className="login-btn">
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>
          <div className="mobile_menu d-block d-lg-none"></div>
        </div>
      </div>
    </header>
  );
};
