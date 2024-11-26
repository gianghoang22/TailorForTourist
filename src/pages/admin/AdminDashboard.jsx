import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Import Outlet for nested routes
import logo from "./../../assets/img/icon/matcha.png";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const location = useLocation();
  const notificationCount = 5; // Example notification count
  const handleLogout = () => {
    // Clear user-related data from localStorage

    localStorage.removeItem("userID");

    localStorage.removeItem("roleID");

    localStorage.removeItem("token");

    Copy;
    // Redirect to the login page
    navigate("/signin");
  };
  return (
    <div className="admin-dashboard">
      <div className="flex">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "160px", height: "auto" }}
            />
            <span className="title">A.</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <img
                alt="User Avatar"
                src="https://storage.googleapis.com/a1aa/image/BCLG9m5sUnK8F5cPgFxdMVxgheb4LPh5b79gVeD1ZZyGBHlTA.jpg"
              />
              <p className="user-name"></p>
            </div>
            <ul className="menu">
              <li>
                <Link
                  className={`${location.pathname === "/admin" ? "active" : ""}`}
                  to="/admin"
                >
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/admin/user-management" ? "active" : ""}`}
                  to="/admin/user-management"
                >
                  <i className="fas fa-users"></i> User Management
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/admin/fabric" ? "active" : ""}`}
                  to="/admin/fabric-management"
                >
                  <i className="fas fa-chart-line"></i> Fabric
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/admin/lining" ? "active" : ""}`}
                  to="/admin/lining-management"
                >
                  <i className="fas fa-truck"></i> Lining
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/admin/store" ? "active" : ""}`}
                  to="/admin/store-management"
                >
                  <i className="fas fa-truck"></i> Store
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/admin/voucher" ? "active" : ""}`}
                  to="/admin/voucher-management"
                >
                  <i className="fas fa-truck"></i> Voucher
                </Link>
              </li>

              <li>
                <Link
                  className="logout-link"
                  to="/signin"
                  onClick={handleLogout}
                >
                  <i className="fas fa-logout"></i> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <h1>Hi, Welcome back</h1>
            <div className="header-icons">
              {/* Language Change Icon (Globe) */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/61/61027.png"
                alt="Globe Icon"
                style={{
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
              />

              {/* Notifications Icon (Updated Bell) */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  marginRight: "1rem",
                }}
                aria-label="Notifications"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/60/60753.png"
                  alt="Bell Icon"
                  style={{ width: "24px", height: "24px" }}
                />
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-10px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <img
                alt="User Avatar"
                src="https://storage.googleapis.com/a1aa/image/BCLG9m5sUnK8F5cPgFxdMVxgheb4LPh5b79gVeD1ZZyGBHlTA.jpg"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  marginLeft: "1rem",
                }}
              />
            </div>
          </div>
          {/* Conditional Rendering of Stats and Graphs */}
          {location.pathname !== "/admin/user-management" &&
            location.pathname !== "/admin/fabric-management" &&
            location.pathname !== "/admin/lining-management" &&
            location.pathname !== "/admin/store-management" &&
            location.pathname !== "/admin/voucher-management" && (
              <>
                <div className="stats">
                  <div className="stat-item blue">
                    <i className="fab fa-android"></i>
                    <p className="stat-value">714k</p>
                    <p className="stat-label">Weekly Sales</p>
                  </div>
                  <div className="stat-item blue-light">
                    <i className="fab fa-apple"></i>
                    <p className="stat-value">1.35m</p>
                    <p className="stat-label">New Users</p>
                  </div>
                  <div className="stat-item yellow">
                    <i className="fab fa-windows"></i>
                    <p className="stat-value">1.72m</p>
                    <p className="stat-label">Item Orders</p>
                  </div>
                  <div className="stat-item red">
                    <i className="fas fa-bug"></i>
                    <p className="stat-value">234</p>
                    <p className="stat-label">Bug Reports</p>
                  </div>
                </div>
                <div className="content">
                  <div className="visits">
                    <h2>Website Visits</h2>
                    <p>(+43%) than last year</p>
                    <img
                      className="graph"
                      alt="Graph showing website visits"
                      src="https://storage.googleapis.com/a1aa/image/YSljUhYQmp6PNhCir0KXcn4sKmXS6rf3dAPmBfCfeEwdEcUOB.jpg"
                    />
                  </div>
                  <div className="current-visits">
                    <h2>Current Visits</h2>
                    <div className="pie-chart">
                      <div className="label label-1">27.7%</div>
                      <div className="label label-2">34.7%</div>
                      <div className="label label-3">28.4%</div>
                      <div className="label label-4">9.2%</div>
                    </div>
                    <div className="legend">
                      <div className="legend-item">
                        <div className="color blue"></div>
                        <p>America</p>
                      </div>
                      <div className="legend-item">
                        <div className="color yellow"></div>
                        <p>Asia</p>
                      </div>
                      <div className="legend-item">
                        <div className="color red"></div>
                        <p>Europe</p>
                      </div>
                      <div className="legend-item">
                        <div className="color green"></div>
                        <p>Africa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          {/* Outlet for child routes */}
          <Outlet />{" "}
          {/* This will render the StaffManagement component when the route matches */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
