import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Import Outlet for nested routes
import logo from "./../../assets/img/icon/matcha.png";
import "./AdminDashboard.scss";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Import the FileDownloadIcon
import { calculateStoreRevenue } from "../../utils/revenueCalculator";

const AdminDashboard = () => {
  const location = useLocation();
  const notificationCount = 5; // Example notification count
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalFabrics: 0,
    totalStores: 0,
    activeVouchers: 0,
  });

  // Add new state for transactions
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Add new state for total revenue
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
    fetchTransactions(); // Add this new fetch call
    fetchOrdersAndCalculateTotal(); // Fetch orders on component mount
  }, []);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      // Fetch users count
      const usersResponse = await fetch("https://vesttour.xyz/api/User", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!usersResponse.ok) {
        throw new Error(`Users API error: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();

      // Fetch fabrics count
      const fabricsResponse = await fetch(
        "https://vesttour.xyz/api/Fabrics",
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

      // Fetch stores count
      const storesResponse = await fetch("https://vesttour.xyz/api/Store", {
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

      // Fetch active vouchers count
      const vouchersResponse = await fetch(
        "https://vesttour.xyz/api/Voucher",
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

      // Update dashboard stats
      setDashboardStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalFabrics: Array.isArray(fabricsData) ? fabricsData.length : 0,
        totalStores: Array.isArray(storesData) ? storesData.length : 0,
        activeVouchers: Array.isArray(vouchersData)
          ? vouchersData.filter(
              (v) => v.status === "Active" || v.status === "OnGoing"
            ).length
          : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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

  // Add new function to fetch transactions
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch("https://vesttour.xyz/api/Payments", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Payments API error: ${response.status}`);
      }

      const data = await response.json();
      // Sort transactions by paymentId in descending order
      const sortedData = data.sort((a, b) => b.paymentId - a.paymentId);
      setTransactions(sortedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Add these handler functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add this function after the other function declarations
  const exportToCSV = () => {
    // Convert transactions data to CSV format
    const headers = [
      "Payment ID",
      "Date",
      "Method",
      "Details",
      "Amount",
      "Status",
    ];
    const csvData = transactions.map((transaction) => [
      transaction.paymentId,
      new Date(transaction.paymentDate).toLocaleDateString("en-US"),
      transaction.method,
      transaction.paymentDetails,
      transaction.amount.toFixed(2),
      transaction.status,
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update the renderTransactionsSection function
  const renderTransactionsSection = () => (
    <Box sx={{ flex: "1 1 70%" }}>
      <Paper
        sx={{
          p: 3,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          background: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              color: "#1a237e",
            }}
          >
            <i className="fas fa-money-bill-wave"></i> Recent Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={exportToCSV}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Export to CSV
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                  Payment ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                  Method
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                  Details
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow
                    key={transaction.paymentId}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <TableCell>#{transaction.paymentId}</TableCell>
                    <TableCell>
                      {new Date(transaction.paymentDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.method}
                        size="small"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1565c0",
                          fontWeight: "medium",
                        }}
                      />
                    </TableCell>
                    <TableCell>{transaction.paymentDetails}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: "#2e7d32", fontWeight: "bold" }}>
                        ${transaction.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            transaction.status === "Success"
                              ? "#e8f5e9"
                              : transaction.status === "Pending"
                                ? "#fff3e0"
                                : "#ffebee",
                          color:
                            transaction.status === "Success"
                              ? "#2e7d32"
                              : transaction.status === "Pending"
                                ? "#e65100"
                                : "#c62828",
                          fontWeight: "medium",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={transactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                margin: 0,
              },
          }}
        />
      </Paper>
    </Box>
  );

  // Update the fetchOrdersAndCalculateTotal function
  const fetchOrdersAndCalculateTotal = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      // First, fetch all active stores
      const storesResponse = await fetch("https://vesttour.xyz/api/Store", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!storesResponse.ok) throw new Error("Failed to fetch stores");
      const storesData = await storesResponse.json();

      // Filter only active stores
      const activeStores = Array.isArray(storesData)
        ? storesData.filter((store) => store.status === "Active")
        : [];

      // Fetch orders for each active store and calculate their revenue
      const storeRevenues = await Promise.all(
        activeStores.map(async (store) => {
          const ordersResponse = await fetch(
            `https://vesttour.xyz/api/Orders/store/${store.storeId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!ordersResponse.ok) throw new Error("Failed to fetch orders");
          const ordersData = await ordersResponse.json();

          // Calculate revenue for each order using the same logic as StoreRevenue
          const ordersWithRevenue = await Promise.all(
            ordersData.map(async (order) => {
              if (order.shipStatus === "Finished") {
                const revenueData = await calculateStoreRevenue(order.orderId);
                return revenueData.storeRevenue || 0;
              }
              return 0;
            })
          );

          // Sum up all order revenues for this store
          return ordersWithRevenue.reduce((sum, revenue) => sum + revenue, 0);
        })
      );

      // Calculate total revenue across all stores
      const totalRevenue = storeRevenues.reduce(
        (sum, revenue) => sum + revenue,
        0
      );
      setTotalRevenue(totalRevenue);
    } catch (error) {
      console.error("Error calculating total revenue:", error);
      setTotalRevenue(0);
    }
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
                  className={`${location.pathname === "/admin/shipper" ? "active" : ""}`}
                  to="/admin/shipper-management"
                >
                  <i className="fas fa-truck"></i> Shipper Partner
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/admin/store-revenue" ? "active" : ""}`}
                  to="/admin/store-revenue"
                >
                  <i className="fas fa-chart-line"></i> Store Revenue
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

              {/* Total Revenue Section */}
              <div className="total-revenue">
                <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
              </div>

              {/* Recent Transactions Section */}
              <div className="recent-transactions">
                {renderTransactionsSection()}
              </div>

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
            </>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
