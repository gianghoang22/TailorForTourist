import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Import Outlet for nested routes
import logo from "./../../assets/img/icon/matcha.png";
import "./AdminDashboard.scss";
import { Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const location = useLocation();
  const notificationCount = 5; // Example notification count
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalFabrics: 0,
    totalStores: 0,
    activeVouchers: 0,
  });

  // Add new state for chart data
  const [userChartData, setUserChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("token");

    // First, check if we have a token
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      // Fetch users count
      const usersResponse = await fetch("https://localhost:7194/api/User", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log("Users Response:", usersResponse);

      if (!usersResponse.ok) {
        throw new Error(`Users API error: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();
      console.log("Users Data:", usersData);

      // Process user data for chart
      processUserDataForChart(usersData);

      // Fetch fabrics count
      const fabricsResponse = await fetch(
        "https://localhost:7194/api/Fabrics",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!fabricsResponse.ok) {
        throw new Error(`Fabrics API error: ${fabricsResponse.status}`);
      }

      const fabricsData = await fabricsResponse.json();
      console.log("Fabrics Data:", fabricsData);

      // Fetch stores count
      const storesResponse = await fetch("https://localhost:7194/api/Store", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!storesResponse.ok) {
        throw new Error(`Stores API error: ${storesResponse.status}`);
      }

      const storesData = await storesResponse.json();
      console.log("Stores Data:", storesData);

      // Fetch active vouchers count
      const vouchersResponse = await fetch(
        "https://localhost:7194/api/Voucher",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!vouchersResponse.ok) {
        throw new Error(`Vouchers API error: ${vouchersResponse.status}`);
      }

      const vouchersData = await vouchersResponse.json();
      console.log("Vouchers Data:", vouchersData);

      // Update dashboard stats
      setDashboardStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalFabrics: Array.isArray(fabricsData) ? fabricsData.length : 0,
        totalStores: Array.isArray(storesData) ? storesData.length : 0,
        activeVouchers: Array.isArray(vouchersData)
          ? vouchersData.filter((v) => v.status === "Active").length
          : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      console.log("Token used:", token);

      setDashboardStats({
        totalUsers: 0,
        totalFabrics: 0,
        totalStores: 0,
        activeVouchers: 0,
      });
    }
  };

  // Add this useEffect to check token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found");
      // Optionally redirect to login
      // navigate('/signin');
    }
  }, []);

  const handleLogout = () => {
    // Clear user-related data from localStorage

    localStorage.removeItem("userID");

    localStorage.removeItem("roleID");

    localStorage.removeItem("token");

    Copy;
    // Redirect to the login page
    navigate("/signin");
  };

  // Add this check to determine if we're on the main dashboard page
  const isMainDashboard = location.pathname === "/admin";

  // Add function to process user data for chart
  const processUserDataForChart = (users) => {
    const dates = [];
    const activeUsers = [];
    const totalUsers = users.length;

    // Consider a user active if they've been online in the last 15 minutes
    const ACTIVE_THRESHOLD = 15 * 60 * 1000; // 15 minutes in milliseconds

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );

      // Count actually active users
      const activeCount = users.filter((user) => {
        if (!user.lastActive) return false;
        const lastActiveDate = new Date(user.lastActive);
        return Date.now() - lastActiveDate.getTime() <= ACTIVE_THRESHOLD;
      }).length;

      activeUsers.push(activeCount);
    }

    setUserChartData({
      labels: dates,
      datasets: [
        {
          label: "Total Users",
          data: Array(7).fill(totalUsers),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
        },
        {
          label: "Active Users",
          data: activeUsers,
          fill: true,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="flex">
        {/* Sidebar stays visible always */}
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

          {isMainDashboard && (
            <>
              {/* Dashboard Stats */}
              <div className="stats">
                <div className="stat-item blue">
                  <i className="fas fa-users"></i>
                  <p className="stat-value">{dashboardStats.totalUsers}</p>
                  <p className="stat-label">Total Users</p>
                </div>
                <div className="stat-item blue-light">
                  <i className="fas fa-layer-group"></i>
                  <p className="stat-value">{dashboardStats.totalFabrics}</p>
                  <p className="stat-label">Total Fabrics</p>
                </div>
                <div className="stat-item yellow">
                  <i className="fas fa-store"></i>
                  <p className="stat-value">{dashboardStats.totalStores}</p>
                  <p className="stat-label">Total Stores</p>
                </div>
                <div className="stat-item red">
                  <i className="fas fa-ticket-alt"></i>
                  <p className="stat-value">{dashboardStats.activeVouchers}</p>
                  <p className="stat-label">Active Vouchers</p>
                </div>
              </div>

              {/* Main Content Area */}
              <Box sx={{ display: "flex", gap: 3, p: 3 }}>
                {/* User Growth Chart - Now Wider */}
                <Box sx={{ flex: "1 1 70%" }}>
                  <Paper
                    sx={{
                      p: 3,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      background: "white",
                      "& .MuiBox-root": {
                        "& canvas": {
                          backgroundColor: "white",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <i className="fas fa-chart-line"></i> User Growth
                      Analytics
                    </Typography>
                    <Box sx={{ height: 450, position: "relative" }}>
                      {userChartData.labels.length > 0 ? (
                        <Line
                          data={userChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: { precision: 0 },
                                grid: {
                                  color: "rgba(0, 0, 0, 0.1)",
                                },
                                border: {
                                  color: "#e0e0e0",
                                },
                              },
                              x: {
                                grid: {
                                  color: "rgba(0, 0, 0, 0.1)",
                                },
                                ticks: {
                                  color: "#333333",
                                  font: {
                                    weight: "bold",
                                  },
                                },
                                border: {
                                  color: "#e0e0e0",
                                },
                              },
                            },
                            plugins: {
                              legend: {
                                position: "top",
                                labels: {
                                  padding: 20,
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                  usePointStyle: true,
                                  boxWidth: 6,
                                },
                              },
                              title: {
                                display: true,
                                text: "User Registration Trends",
                                font: {
                                  size: 16,
                                  weight: "bold",
                                },
                                padding: {
                                  top: 10,
                                  bottom: 30,
                                },
                                color: "#333333",
                              },
                            },
                            elements: {
                              line: {
                                borderWidth: 2,
                                tension: 0.4,
                              },
                              point: {
                                radius: 4,
                                hitRadius: 10,
                                hoverRadius: 6,
                              },
                            },
                            layout: {
                              padding: {
                                left: 10,
                                right: 20,
                                top: 20,
                                bottom: 10,
                              },
                            },
                            backgroundColor: "white",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <Typography>Loading chart data...</Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>

                {/* System Information Panel */}
                <Box sx={{ flex: "1 1 30%" }}>
                  <Paper
                    sx={{
                      p: 3,
                      height: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      background: "white",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <i className="fas fa-info-circle"></i> System Information
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          background: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography variant="subtitle2" color="textSecondary">
                          <i className="fas fa-clock"></i> Last Updated
                        </Typography>
                        <Typography variant="body1">
                          {new Date().toLocaleString()}
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 2,
                          background: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography variant="subtitle2" color="textSecondary">
                          <i className="fas fa-server"></i> System Status
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#4caf50" }}>
                          Operational
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 2,
                          background: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography variant="subtitle2" color="textSecondary">
                          <i className="fas fa-database"></i> Database Status
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#4caf50" }}>
                          Connected
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 2,
                          background: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography variant="subtitle2" color="textSecondary">
                          <i className="fas fa-code-branch"></i> Version
                        </Typography>
                        <Typography variant="body1">v1.0.0</Typography>
                      </Paper>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
