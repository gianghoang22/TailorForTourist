import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  IconButton,
  Menu,
  FormControl,
  InputLabel,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Backdrop,
  Fade,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./ManagerDashboard.scss";
import logo from "./../../assets/img/icon/matcha.png";
import Pagination from "@mui/material/Pagination";
import { motion } from "framer-motion";
import { calculateStoreRevenue } from "../../utils/revenueCalculator";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#FFA500"; // Orange
    case "Processing":
      return "#3498db"; // Blue
    case "Finish":
      return "#2ecc71"; // Green
    case "Cancel":
      return "#e74c3c"; // Red
    case "Due":
      return "#e67e22"; // Dark Orange
    case "Not Start":
      return "#95a5a6"; // Gray
    case "Doing":
      return "#9b59b6"; // Purple
    default:
      return "#bdc3c7"; // Light Gray
  }
};

const getProcessingStatusColor = (status) => {
  switch (status) {
    case "Not Start":
      return "#95a5a6"; // Gray
    case "Doing":
      return "#3498db"; // Blue
    case "Due":
      return "#e67e22"; // Dark Orange
    case "Finish":
      return "#2ecc71"; // Green
    case "Cancel":
      return "#e74c3c"; // Red
    case "Pending":
      return "#FFA500"; // Orange
    case "Processing":
      return "#9b59b6"; // Purple
    default:
      return "#bdc3c7"; // Light Gray
  }
};

const ManagerDashboard = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [stores, setStores] = useState({});
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
  const [processingData, setProcessingData] = useState({
    processingId: 0,
    stageName: "Make Sample",
    tailorPartnerId: "",
    status: "Not Start",
    orderId: 0,
    note: "",
    dateSample: new Date().toISOString().split("T")[0],
    dateFix: new Date().toISOString().split("T")[0],
    dateDelivery: new Date().toISOString().split("T")[0],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const notificationCount = 5;
  const [tailorPartners, setTailorPartners] = useState([]);
  const [processingStatuses, setProcessingStatuses] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [ordersPerPage] = useState(20);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processStatusFilter, setProcessStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    revenue: 0,
  });
  const [includeFixStage, setIncludeFixStage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const userID = localStorage.getItem("userID");
  const [ordersWithSuits, setOrdersWithSuits] = useState(new Set());
  const [processingStatusMap, setProcessingStatusMap] = useState({});

  const BASE_URL = "https://vesttour.xyz/api";

  const fetchStoreByManagerId = async (userId) => {
    const response = await fetch(`${BASE_URL}/Store/userId/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch store");
    }
    return response.json();
  };

  const fetchOrdersByStoreId = async (storeId) => {
    const response = await fetch(`${BASE_URL}/Orders/store/${storeId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user details");
      return response.json();
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  };

  const fetchStoreDetails = async (storeId) => {
    try {
      const response = await fetch(`${BASE_URL}/Store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch store details");
      return response.json();
    } catch (error) {
      console.error(`Error fetching store ${storeId}:`, error);
      return null;
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/Orders/${orderId}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch order details");
      return await response.json();
    } catch (error) {
      console.error(`Error fetching order details:`, error);
      return null;
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const storeData = await fetchStoreByManagerId(userId);
      const ordersData = await fetchOrdersByStoreId(storeData.storeId);
      const orders = Array.isArray(ordersData) ? ordersData : [ordersData];

      // Track orders with SUIT products
      const ordersWithSuitsSet = new Set();

      // Fetch order details and calculate revenues
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const details = await fetchOrderDetails(order.orderId);
          const revenueData = await calculateStoreRevenue(order.orderId);

          // Calculate SUIT products total
          let suitTotal = 0;

          if (details && details.orderDetails) {
            details.orderDetails.forEach((detail) => {
              if (detail.productCode.startsWith("SUIT")) {
                suitTotal += detail.price * detail.quantity;
                ordersWithSuitsSet.add(order.orderId);
              }
            });
          }

          return {
            ...order,
            suitTotal: suitTotal,
            totalPrice: order.totalPrice || 0,
            calculatedRevenue: revenueData.storeRevenue, // Add store revenue calculation
            revenueShare: revenueData.suitTotal * 0.3, // Store's share of SUIT products (30%)
          };
        })
      );

      setOrdersWithSuits(ordersWithSuitsSet);
      setOrders(ordersWithDetails);

      // Fetch user and store details as before
      const userPromises = ordersWithDetails.map((order) =>
        fetchUserDetails(order.userID)
      );
      const storePromises = ordersWithDetails.map((order) =>
        fetchStoreDetails(order.storeId)
      );

      const users = await Promise.all(userPromises);
      const stores = await Promise.all(storePromises);

      const userMap = {};
      const storeMap = {};

      ordersWithDetails.forEach((order, index) => {
        if (users[index]) {
          userMap[order.userID] = users[index].name || "Unknown";
        }
        if (stores[index]) {
          storeMap[order.storeId] = stores[index].name || "Unknown";
        }
      });

      setUsers(userMap);
      setStores(storeMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders
      .filter((order) => {
        const matchesSearch = order?.note
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || "");

        // Date filtering
        const orderDate = new Date(order.orderDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        const matchesDate =
          dateFilter === "all" ||
          (() => {
            if (dateFilter === "custom") {
              const start = startDate ? new Date(startDate) : null;
              const end = endDate ? new Date(endDate) : null;

              // Set end date to end of day for inclusive comparison
              if (end) {
                end.setHours(23, 59, 59, 999);
              }

              return (
                (!start || orderDate >= start) && (!end || orderDate <= end)
              );
            }

            if (dateFilter === "today") {
              return orderDate.toDateString() === today.toDateString();
            }

            if (dateFilter === "week") {
              const weekAgo = new Date();
              weekAgo.setDate(today.getDate() - 7);
              weekAgo.setHours(0, 0, 0, 0);
              return orderDate >= weekAgo;
            }

            if (dateFilter === "month") {
              // Get first day of previous month
              const previousMonth = new Date();
              previousMonth.setMonth(previousMonth.getMonth() - 1);
              previousMonth.setDate(1);
              previousMonth.setHours(0, 0, 0, 0);

              // Get first day of current month
              const currentMonth = new Date();
              currentMonth.setDate(1);
              currentMonth.setHours(0, 0, 0, 0);

              return orderDate >= previousMonth && orderDate < currentMonth;
            }

            return true;
          })();

        // Status filtering - Fix: Handle null/undefined status
        const matchesStatus =
          statusFilter === "all" ||
          (order?.status && order.status === statusFilter);

        // Process status filtering - Updated to handle "Not in Action"
        const matchesProcessStatus =
          processStatusFilter === "all" ||
          (processStatusFilter === "Not in Action"
            ? !processingStatuses[order.orderId]
            : processingStatuses[order.orderId] === processStatusFilter);

        return (
          matchesSearch && matchesDate && matchesStatus && matchesProcessStatus
        );
      })
      .sort((a, b) => b.orderId - a.orderId);
  }, [
    orders,
    searchTerm,
    dateFilter,
    statusFilter,
    processStatusFilter,
    startDate,
    endDate,
    processingStatuses,
  ]);

  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    console.log("Total orders:", filteredOrders.length);
    console.log("Current page:", page);
    console.log("Orders per page:", ordersPerPage);
    console.log("Current orders shown:", currentOrders.length);
  }, [filteredOrders, page, ordersPerPage, currentOrders]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/signin");
  };

  const fetchStoreInfo = async () => {
    try {
      const userId = localStorage.getItem("userID");
      const response = await fetch(
        `https://vesttour.xyz/api/Store/manager-userId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch store info");
      }

      const data = await response.json();
      setStoreInfo(data);
      return data;
    } catch (error) {
      console.error("Error fetching store info:", error);
      setError("Error fetching store information");
    }
  };

  const fetchTailorPartners = async () => {
    if (!storeInfo) return;

    const token = localStorage.getItem("token");
    try {
      // Nếu có tailorPartner trong storeInfo, chỉ lấy tailor đó
      if (storeInfo.tailorPartner) {
        setTailorPartners([storeInfo.tailorPartner]);
      } else {
        setError("No tailor partner found for this store");
      }
    } catch (error) {
      console.error("Error fetching tailor partners:", error);
      setError("Error fetching tailor partners. Please try again later.");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchStoreInfo();
      fetchOrders();
    };

    if (userID) {
      initializeData();
    }
  }, [userID]);

  useEffect(() => {
    if (storeInfo) {
      fetchTailorPartners();
    }
  }, [storeInfo]);

  const handleProcessTailor = async (order) => {
    if (!order) return;

    setIsFetchingDetails(true);
    try {
      const orderDetails = await fetchOrderDetails(order.orderId);
      if (!orderDetails) {
        setError("Failed to fetch order details");
        return;
      }

      const suitProducts = orderDetails.orderDetails.filter((detail) =>
        detail.productCode.startsWith("SUIT")
      );

      if (suitProducts.length === 0) {
        setError("No suit products found in this order");
        return;
      }

      // Get today's date and format it to YYYY-MM-DD
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0];

      // Calculate initial dates
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 1);

      setProcessingData({
        ...processingData,
        orderId: order.orderId || 0,
        tailorPartnerId: storeInfo?.tailorPartner?.tailorPartnerId || "",
        dateSample: formattedToday,
        dateDelivery: deliveryDate.toISOString().split("T")[0],
      });

      setProcessingDialogOpen(true);
    } catch (error) {
      console.error("Error processing order:", error);
      setError("Failed to process order");
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleProcessingChange = (e) => {
    const { name, value } = e.target;
    setProcessingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcessingSubmit = async () => {
    setLoading(true);
    try {
      // First, submit the processing data
      const processingResponse = await fetch(
        "https://vesttour.xyz/api/ProcessingTailor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            processingId: 0,
            stageName: "Make Sample",
            tailorPartnerId: processingData.tailorPartnerId,
            status: "Not Start",
            orderId: processingData.orderId,
            note: processingData.note || "",
            dateSample: processingData.dateSample,
            dateFix: includeFixStage ? processingData.dateFix : null,
            dateDelivery: processingData.dateDelivery,
          }),
        }
      );

      if (!processingResponse.ok) {
        throw new Error("Failed to process tailor");
      }

      // After successful processing, update the order status to "Processing"
      const statusUpdateResponse = await fetch(
        `https://vesttour.xyz/api/Orders/updatestatus/${processingData.orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify("Processing"),
        }
      );

      if (!statusUpdateResponse.ok) {
        throw new Error("Failed to update order status");
      }

      // Immediately update local state
      setProcessingStatusMap((prev) => ({
        ...prev,
        [processingData.orderId]: "Not Start",
      }));

      setProcessingDialogOpen(false);
      setError(null);
      alert("Successfully transferred!");

      // Refresh orders in the background
      fetchOrders();
    } catch (error) {
      console.error("Error processing tailor:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value?.toLowerCase() || "");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Orders/updatestatus/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStatus),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      await fetchOrderStatus(orderId);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchOrderStatus = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: data.status } : order
        )
      );
    } catch (error) {
      console.error("Error fetching updated order status:", error);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const FilterControls = () => (
    <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
      <TextField
        label="Search by Note"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Date Filter</InputLabel>
        <Select
          value={dateFilter}
          label="Date Filter"
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">Last Week</MenuItem>
          <MenuItem value="month">Last Month</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>
      </FormControl>

      {dateFilter === "custom" && (
        <>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Order Status</InputLabel>
        <Select
          value={statusFilter}
          label="Order Status"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Finish">Finish</MenuItem>
          <MenuItem value="Cancel">Cancel</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Process Status</InputLabel>
        <Select
          value={processStatusFilter}
          label="Process Status"
          onChange={(e) => setProcessStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="Not in Action">Not in Action</MenuItem>
          <MenuItem value="Doing">Doing</MenuItem>
          <MenuItem value="Due">Due</MenuItem>
          <MenuItem value="Finish">Finish</MenuItem>
          <MenuItem value="Not Start">Not Start</MenuItem>
          <MenuItem value="Cancel">Cancel</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  useEffect(() => {
    const calculateStats = async () => {
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "Pending").length,
        processingOrders: orders.filter((o) => o.status === "Processing")
          .length,
        completedOrders: orders.filter((o) => o.status === "Finish").length,
        revenue: orders
          .filter((o) => o.shipStatus === "Finished") // Only count finished orders
          .reduce((sum, order) => sum + (order.calculatedRevenue || 0), 0), // Use calculatedRevenue instead of raw totalPrice
      };
      setDashboardStats(stats);
    };

    calculateStats();
  }, [orders]);

  const StatisticsSummary = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 2,
        mb: 4,
      }}
    >
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6">{dashboardStats.totalOrders}</Typography>
        <Typography color="textSecondary">Total Orders</Typography>
      </Paper>
      <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fff3e0" }}>
        <Typography variant="h6">{dashboardStats.pendingOrders}</Typography>
        <Typography color="textSecondary">Pending</Typography>
      </Paper>
      <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e3f2fd" }}>
        <Typography variant="h6">{dashboardStats.processingOrders}</Typography>
        <Typography color="textSecondary">Processing</Typography>
      </Paper>
      <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e9" }}>
        <Typography variant="h6">{dashboardStats.completedOrders}</Typography>
        <Typography color="textSecondary">Completed</Typography>
      </Paper>
      <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f3e5f5" }}>
        <Typography variant="h6">
          ${dashboardStats.revenue.toFixed(2)}
        </Typography>
        <Typography color="textSecondary">Store Revenue</Typography>
      </Paper>
    </Box>
  );

  useEffect(() => {
    console.log("Current filters:", {
      statusFilter,
      processStatusFilter,
      processingStatuses,
      filteredOrdersLength: filteredOrders.length,
    });
  }, [statusFilter, processStatusFilter, processingStatuses, filteredOrders]);

  const fetchProcessingStatuses = async () => {
    try {
      const response = await fetch(
        "https://vesttour.xyz/api/ProcessingTailor",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data } = await response.json();

      // Create a new status map
      const newStatusMap = {};
      data.forEach((processing) => {
        newStatusMap[processing.orderId] = processing.status;
      });

      // Only update state if there are actual changes
      setProcessingStatusMap((prevMap) => {
        const hasChanges =
          JSON.stringify(prevMap) !== JSON.stringify(newStatusMap);
        return hasChanges ? newStatusMap : prevMap;
      });
    } catch (error) {
      console.error("Error fetching processing statuses:", error);
    }
  };

  // Add this new effect to handle initial load and websocket connection
  useEffect(() => {
    // Initial fetch
    fetchProcessingStatuses();

    // Set up WebSocket connection
    const ws = new WebSocket("wss://vesttour.xyz/processingStatusHub");

    ws.onmessage = (event) => {
      const { orderId, status } = JSON.parse(event.data);
      setProcessingStatusMap((prev) => ({
        ...prev,
        [orderId]: status,
      }));
    };

    // Polling fallback
    const pollInterval = setInterval(fetchProcessingStatuses, 30000);

    return () => {
      ws.close();
      clearInterval(pollInterval);
    };
  }, []);

  // Add this validation function
  const isDateValid = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(selectedDate);
    return dateToCheck >= today;
  };

  const ProcessingStatusCell = ({ orderId }) => {
    const status = processingStatusMap[orderId];

    return (
      <TableCell>
        <Tooltip title={`Processing Status: ${status || "Not in Action"}`}>
          <span
            style={{
              backgroundColor: getProcessingStatusColor(status),
              color: "white",
              padding: "4px 8px",
              borderRadius: "5px",
              fontSize: "12px",
              cursor: "help",
              display: "inline-block",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            {status || "Not in Action"}
          </span>
        </Tooltip>
      </TableCell>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="manager-dashboard"
    >
      <div className="flex">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sidebar"
        >
          <div className="logo">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "160px", height: "auto" }}
            />
          </div>
          <div className="user-info">
            <ul className="menu">
              <li>
                <Link
                  className={`${location.pathname === "/manager" ? "active" : ""}`}
                  to="/manager"
                >
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/manager/staff-management" ? "active" : ""}`}
                  to="/manager/staff-management"
                >
                  <i className="fas fa-users"></i> Staff Management
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/manager/profitcalculation" ? "active" : ""}`}
                  to="/manager/profitcalculation"
                >
                  <i className="fas fa-chart-bar"></i> Statistics
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/manager/product" ? "active" : ""}`}
                  to="/manager/product"
                >
                  <i className="fas fa-chart-bar"></i> Product
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/manager/voucheravailable" ? "active" : ""}`}
                  to="/manager/voucheravailable"
                >
                  <i className="fas fa-chart-bar"></i> Voucher
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/manager/booking" ? "active" : ""}`}
                  to="/manager/booking"
                >
                  <i className="fas fa-shipping-fast"></i> Booking
                </Link>
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
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="main-content"
        >
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              flexDirection: "column",
              gap: 2,
            }}
            open={isLoading || isFetchingDetails}
          >
            <CircularProgress color="inherit" />
            <div>{isLoading ? "Loading orders..." : "Fetching details..."}</div>
          </Backdrop>

          <div className="header">
            <h1>Hi, Welcome back</h1>
            <div className="header-icons">
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

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <CircularProgress />
          ) : (
            location.pathname === "/manager" && (
              <>
                <StatisticsSummary />
                <FilterControls />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>User Name</TableCell>
                        <TableCell>Store Name</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Shipped Date</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Processing Status</TableCell>
                        <TableCell>Actions</TableCell>
                        <TableCell>Update Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>{order.orderId}</TableCell>
                          <TableCell>
                            {users[order.userID] ||
                              order.guestName ||
                              "Unknown"}
                          </TableCell>
                          <TableCell>
                            {stores[order.storeId] || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {order.shippedDate
                              ? new Date(order.shippedDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>{order.note || "-"}</TableCell>
                          <TableCell>{order.paid ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            <span
                              style={{
                                backgroundColor: getStatusColor(order.status),
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "5px",
                                fontSize: "12px",
                              }}
                            >
                              {order.status || "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {ordersWithSuits.has(order.orderId) ? (
                              <div>
                                <div>
                                  Suit: ${order.suitTotal?.toFixed(2) || "0.00"}
                                </div>
                                <div
                                  style={{ color: "gray", fontSize: "0.9em" }}
                                >
                                  Total: $
                                  {order.totalPrice?.toFixed(2) || "0.00"}
                                </div>
                              </div>
                            ) : (
                              <div>
                                Total: ${order.totalPrice?.toFixed(2) || "0.00"}
                              </div>
                            )}
                          </TableCell>
                          <ProcessingStatusCell orderId={order.orderId} />
                          <TableCell>
                            <Tooltip
                              title={
                                processingStatusMap[order.orderId]
                                  ? "This order has already been processed"
                                  : ordersWithSuits.has(order.orderId)
                                    ? "Process tailor order"
                                    : "This order does not contain any suit products"
                              }
                            >
                              <span>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleProcessTailor(order)}
                                  disabled={
                                    !ordersWithSuits.has(order.orderId) ||
                                    processingStatusMap[order.orderId] !==
                                      undefined
                                  }
                                >
                                  Process Tailor
                                </Button>
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.orderId,
                                  e.target.value
                                )
                              }
                              disabled={updatingStatus}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Processing">Processing</MenuItem>
                              <MenuItem value="Finish">Finish</MenuItem>
                              <MenuItem value="Cancel">Cancel</MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Dialog
                  open={processingDialogOpen}
                  onClose={() => setProcessingDialogOpen(false)}
                >
                  <DialogTitle>Process Tailor</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Stage Name"
                      name="stageName"
                      value="Make Sample"
                      disabled
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      label="Status"
                      name="status"
                      value="Not Start"
                      disabled
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      label="Tailor Partner Location"
                      name="tailorPartnerId"
                      select
                      value={processingData.tailorPartnerId}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                      disabled={true}
                      SelectProps={{
                        IconComponent: () => null,
                      }}
                    >
                      {storeInfo?.tailorPartner ? (
                        <MenuItem
                          value={storeInfo.tailorPartner.tailorPartnerId}
                        >
                          {storeInfo.tailorPartner.location}
                        </MenuItem>
                      ) : (
                        <MenuItem value="">
                          <em>No tailor partner available</em>
                        </MenuItem>
                      )}
                    </TextField>
                    <TextField
                      label="Note"
                      name="note"
                      value={processingData.note}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={includeFixStage}
                          onChange={(e) => {
                            setIncludeFixStage(e.target.checked);
                            if (processingData.dateSample) {
                              const sampleDate = new Date(
                                processingData.dateSample
                              );
                              const fixDate = new Date(sampleDate);
                              fixDate.setDate(sampleDate.getDate() + 1);
                              const deliveryDate = new Date(sampleDate);
                              deliveryDate.setDate(
                                sampleDate.getDate() +
                                  (e.target.checked ? 2 : 1)
                              );

                              setProcessingData((prev) => ({
                                ...prev,
                                ...(e.target.checked && {
                                  dateFix: fixDate.toISOString().split("T")[0],
                                  dateDelivery: deliveryDate
                                    .toISOString()
                                    .split("T")[0],
                                }),
                                ...(!e.target.checked && {
                                  dateDelivery: deliveryDate
                                    .toISOString()
                                    .split("T")[0],
                                }),
                              }));
                            }
                          }}
                        />
                      }
                      label="Include Fix Stage (Optional)"
                    />

                    <TextField
                      label="Date Sample"
                      name="dateSample"
                      type="date"
                      value={processingData.dateSample}
                      onChange={(e) => {
                        const newSampleDate = e.target.value;

                        // Validate the selected date
                        if (!isDateValid(newSampleDate)) {
                          setError("Cannot select a past date");
                          return;
                        }

                        const sampleDate = new Date(newSampleDate);

                        // Calculate new dates based on sample date
                        const fixDate = new Date(sampleDate);
                        fixDate.setDate(sampleDate.getDate() + 1);
                        const deliveryDate = new Date(sampleDate);
                        deliveryDate.setDate(
                          sampleDate.getDate() + (includeFixStage ? 2 : 1)
                        );

                        setProcessingData((prev) => ({
                          ...prev,
                          dateSample: newSampleDate,
                          ...(includeFixStage && {
                            dateFix: fixDate.toISOString().split("T")[0],
                            dateDelivery: deliveryDate
                              .toISOString()
                              .split("T")[0],
                          }),
                          ...(!includeFixStage && {
                            dateDelivery: deliveryDate
                              .toISOString()
                              .split("T")[0],
                          }),
                        }));
                        setError(null); // Clear any previous error
                      }}
                      fullWidth
                      margin="dense"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0], // Set minimum date to today
                      }}
                    />

                    {includeFixStage && (
                      <TextField
                        label="Date Fix"
                        name="dateFix"
                        type="date"
                        value={processingData.dateFix}
                        disabled
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}

                    <TextField
                      label="Date Delivery"
                      name="dateDelivery"
                      type="date"
                      value={processingData.dateDelivery}
                      disabled
                      fullWidth
                      margin="dense"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setProcessingDialogOpen(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProcessingSubmit}
                      color="primary"
                      disabled={!processingData.tailorPartnerId || loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                  </DialogActions>
                </Dialog>
                {filteredOrders.length > ordersPerPage && (
                  <div className="pagination">
                    <button
                      className={`pagination-btn ${page === 1 ? "disabled" : ""}`}
                      disabled={page === 1}
                      onClick={(e) => handlePageChange(e, page - 1)}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    <div className="page-numbers">
                      {Array.from(
                        {
                          length: Math.ceil(
                            filteredOrders.length / ordersPerPage
                          ),
                        },
                        (_, index) => (
                          <button
                            key={index + 1}
                            className={`page-number ${page === index + 1 ? "active" : ""}`}
                            onClick={(e) => handlePageChange(e, index + 1)}
                          >
                            {index + 1}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className={`pagination-btn ${
                        page ===
                        Math.ceil(filteredOrders.length / ordersPerPage)
                          ? "disabled"
                          : ""
                      }`}
                      disabled={
                        page ===
                        Math.ceil(filteredOrders.length / ordersPerPage)
                      }
                      onClick={(e) => handlePageChange(e, page + 1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )
          )}

          <Outlet />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ManagerDashboard;
