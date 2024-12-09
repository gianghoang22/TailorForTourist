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
            <Link to='/'>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "160px", height: "auto" }}
              />{" "}
              {/* Adjust the width as needed */}
            </Link>
          </div>
          <nav className="main-menu d-none d-lg-block">
            <div className="main-menu f-right d-none d-lg-block">
              <ul id="navigation" className="d-flex justify-content-between">
                <li>
                  <a>SUITS</a>
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
                  <a>BLAZERS</a>
                  <ul className="submenu">
                    <li>
                      <Link to='/product-collection'>BLAZERS COLLECTION</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>SHIRTS</a>
                  <ul className="submenu">
                    <li>
                      <Link to='/product-collection'>SHIRTS COLLECTIONS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>PANTS</a>
                  <ul className="submenu">
                    <li>
                      <Link to='/product-collection'>PANTS COLLECTIONS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to='/product-collection'>COAT</Link>
                </li>
                <li>
                  <a>WOMEN</a>
                  <ul className="submenu">
                    <li>
                      <Link to='/product-collection'>SUITS</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>PANTS</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>BLAZERS</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>DRESS</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>SKIRT</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>TOP & BLOUSE</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>OVERCOAT</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>BUSINESS DRESS</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>BUSINESS SHIRTS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>WEDDING</a>
                  <ul className="submenu">
                    <li>
                      <Link to='/product-collection'>GROOM</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>BRIDESMAID</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>BRIDE</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>ACCESSORIES</a>
                  <ul className="submenu">
                    <li>
                      <Link to='/product-collection'>TIES</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>BOW TIES</Link>
                    </li>
                    <li>
                      <Link to='/product-collection'>MASKS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/contact-us">CONTACT</Link>
                </li>
                <li>
                  <Link to="/how-to-measure">HOW TO MEASURE</Link>
                </li>
                <li>
                  <Link to="/cart">CART</Link>
                </li>
                {isLoggedIn && roleID === "customer" && (
                  <li>
                    <Link to="/profile">PROFILE</Link>
                  </li>
                )}
                
              </ul>
            </div>
          </nav>
          <div className="header-right-btn d-none d-lg-block ml-30" style={{padding: "0 12px"}}>
            {/* Render Booking button for all users, but restrict access in logic */}
            {(isLoggedIn && roleID === "customer") || !isLoggedIn ? (
                  <li>
                    <Link to="/booking" className="booking-btn">
                      <FaCalendarAlt /> BOOKING
                    </Link>
                </li>
              ) : null}
          </div>
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
