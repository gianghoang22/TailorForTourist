import React from "react";
import "../navigation/Navigation.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/img/logo/logo.png";
import { useNavigate } from "react-router-dom";

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

  const isLoggedIn = !!localStorage.getItem("userID"); // Check if userID exists in localStorage

  return (
    <header className="header-area header_area">
      <div className="main-header header-sticky">
        <div className="container-header d-flex justify-content-between align-items-center">
          <div className="logo">
            <a href="#">
              <img src={logo} alt="Logo" />
            </a>
          </div>
          <nav className="main-menu d-none d-lg-block">
            <div className="main-menu f-right d-none d-lg-block">
              <ul id="navigation" className="d-flex justify-content-between">
                <li>
                  <a href="#">SUITS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">DESIGN YOUR SUITS</a>
                    </li>
                    <li>
                      <a href="#">COLLECTIONS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">BLAZERS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">DESIGN YOUR BLAZERS</a>
                    </li>
                    <li>
                      <a href="#">BLAZERS COLLECTION</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">SHIRTS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">DESIGN YOUR SHIRTS</a>
                    </li>
                    <li>
                      <a href="#">COLLECTIONS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">PANTS</a>
                  <ul className="submenu">
                    <li>
                      <a href="#">DESIGN YOUR PANTS</a>
                    </li>
                    <li>
                      <a href="#">COLLECTIONS</a>
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
                      <a href="#">BRIDESMAID</a>
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
                  <a href="#">Contact</a>
                </li>
                {isLoggedIn && (
                  <li>
                    <a href="/profile">Profile</a>
                  </li>
                )}
              </ul>
            </div>
          </nav>
          <div className="header-right-btn d-none d-lg-block ml-30">
            {isLoggedIn ? (
              <button className="header-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <a href="/signin" className="header-btn">
                Login
              </a>
            )}
            <a href="/booking" className="header-btn">
              Booking
            </a>
          </div>
          <div className="mobile_menu d-block d-lg-none"></div>
        </div>
      </div>
    </header>
  );
};
