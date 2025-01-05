import React from "react";
import "../navigation/Navigation.scss"; // Adjust the path as necessary
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./../../../assets/img/icon/matcha.png"; // Adjust the path as necessary
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa"; // Import icons

// Add these styles to your Navigation.scss file
const navigationStyles = `
.main-header {
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-list {
  display: flex;
  gap: 2rem; // Adds consistent spacing between menu items
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #b87d3b; // Assuming this matches your brand color
}

// Add underline effect on hover
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #b87d3b;
  transition: all 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}

// Submenu styling
.submenu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1rem 0;
  min-width: 200px;
}

.submenu-link {
  padding: 8px 20px;
  display: block;
  font-size: 13px;
  transition: background-color 0.3s ease;
}

.submenu-link:hover {
  background-color: #f5f5f5;
  color: #b87d3b;
}

// Right-side actions
.header-actions {
  gap: 1rem;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.booking-btn {
  background-color: #b87d3b;
  color: white;
}

.booking-btn:hover {
  background-color: #a06830;
}

.login-btn {
  border: 2px solid #b87d3b;
  color: #b87d3b;
}

.login-btn:hover {
  background-color: #b87d3b;
  color: white;
}

// Separator between main nav and actions
.nav-separator {
  height: 24px;
  width: 1px;
  background-color: #e0e0e0;
  margin: 0 1rem;
}
`;

export const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const userID = localStorage.getItem("userID");
  const roleID = localStorage.getItem("roleID");
  const isLoggedIn = !!userID;

  return (
    <header className="header-area header_area">
      <div className="main-header header-sticky">
        <div className="container-header d-flex justify-content-between align-items-center">
          <div className="logo">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "160px", height: "auto" }}
              />
            </Link>
          </div>
          <nav className="main-menu d-none d-lg-block">
            <div className="main-menu f-right d-none d-lg-block">
              <ul id="navigation" className="d-flex justify-content-between">
                <li>
                  <a>SUITS</a>
                  <ul className="submenu">
                    {isLoggedIn && (
                      <li>
                        <Link to="/custom-suits">DESIGN YOUR SUITS</Link>
                      </li>
                    )}
                    <li>
                      <Link to="/product-collection">COLLECTIONS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>BLAZERS</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/product-collection">BLAZERS COLLECTION</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>SHIRTS</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/product-collection">SHIRTS COLLECTIONS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>PANTS</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/product-collection">PANTS COLLECTIONS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/product-collection">COAT</Link>
                </li>
                <li>
                  <a>WOMEN</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/product-collection">SUITS</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">PANTS</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">BLAZERS</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">DRESS</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">SKIRT</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">TOP & BLOUSE</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">OVERCOAT</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">BUSINESS DRESS</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">BUSINESS SHIRTS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>WEDDING</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/product-collection">GROOM</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">BRIDESMAID</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">BRIDE</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>ACCESSORIES</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/product-collection">TIES</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">BOW TIES</Link>
                    </li>
                    <li>
                      <Link to="/product-collection">MASKS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/contact-us">CONTACT</Link>
                </li>
                <li>
                  <Link to="/how-to-measure">HOW TO MEASURE</Link>
                </li>
                {isLoggedIn && (
                  <li>
                    <Link to="/cart">CART</Link>
                  </li>
                )}
                {isLoggedIn && roleID === "customer" && (
                  <li>
                    <Link to="/profile">PROFILE</Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
          <div
            className="header-right-btn d-none d-lg-block ml-30"
            style={{ padding: "0 12px" }}
          >
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