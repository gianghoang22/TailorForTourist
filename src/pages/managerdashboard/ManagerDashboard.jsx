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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./ManagerDashboard.scss";
import logo from "./../../assets/img/icon/matcha.png";
const ManagerDashboard = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [stores, setStores] = useState({});
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
  const [processingData, setProcessingData] = useState({
    processingId: 0,
    stageName: "",
    tailorPartnerId: "",
    status: "",
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
  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/signin");
  };
  useEffect(() => {
    fetchOrders();
    fetchTailorPartners();
  }, []);

  useEffect(() => {
    const fetchUsersAndStores = async () => {
      const token = localStorage.getItem("token");

      if (!Array.isArray(orders) || orders.length === 0) return;

      const userIds = [
        ...new Set(
          orders.filter((order) => order?.userID).map((order) => order.userID)
        ),
      ];
      const storeIds = [
        ...new Set(
          orders.filter((order) => order?.storeId).map((order) => order.storeId)
        ),
      ];

      const userPromises = userIds.map(async (userId) => {
        try {
          const response = await fetch(
            `https://localhost:7194/api/User/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = await response.json();
          return [userId, userData.name];
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return [userId, "Unknown User"];
        }
      });

      const storePromises = storeIds.map(async (storeId) => {
        try {
          const response = await fetch(
            `https://localhost:7194/api/Store/${storeId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const storeData = await response.json();
          return [storeId, storeData.name];
        } catch (error) {
          console.error(`Error fetching store ${storeId}:`, error);
          return [storeId, "Unknown Store"];
        }
      });

      try {
        const userEntries = await Promise.all(userPromises);
        const storeEntries = await Promise.all(storePromises);

        setUsers(Object.fromEntries(userEntries));
        setStores(Object.fromEntries(storeEntries));
      } catch (error) {
        console.error("Error fetching users and stores:", error);
        setError(
          "Error fetching additional data. Some information may be missing."
        );
      }
    };

    fetchUsersAndStores();
  }, [orders]);

  useEffect(() => {
    const fetchProcessingStatuses = async () => {
      const token = localStorage.getItem("token");

      const statusPromises = orders.map(async (order) => {
        try {
          const response = await fetch(
            `https://localhost:7194/api/ProcessingTailor/GetByOrderId/${order.orderId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch status for order ${order.orderId}`
            );
          }
          const data = await response.json();
          return [order.orderId, data.status];
        } catch (error) {
          console.error(
            `Error fetching processing status for ${order.orderId}:`,
            error
          );
          return [order.orderId, "Unknown"];
        }
      });

      const statuses = await Promise.all(statusPromises);
      setProcessingStatuses(Object.fromEntries(statuses));
    };

    if (orders.length > 0) {
      fetchProcessingStatuses();
    }
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "brown";
      case "Processing":
        return "blue";
      case "Finish":
        return "green";
      case "Cancel":
        return "red";
      default:
        return "gray";
    }
  };

  const getProcessingStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "brown";
      case "Doing":
        return "blue";
      case "Due":
        return "Orange";
      case "Finish":
        return "green";
      case "Not Start":
        return "Pink";
      case "Cancel":
        return "red";
      default:
        return "gray";
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch("https://localhost:7194/api/Orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders. Please try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTailorPartners = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://localhost:7194/api/TailorPartner", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetched tailor partners:", result);
      setTailorPartners(result.data || []);
    } catch (error) {
      console.error("Error fetching tailor partners:", error);
      setError("Error fetching tailor partners. Please try again later.");
    }
  };

  const handleProcessTailor = (order) => {
    if (!order) return;
    setProcessingData({
      ...processingData,
      orderId: order.orderId || 0,
    });
    setProcessingDialogOpen(true);
  };

  const handleProcessingChange = (e) => {
    const { name, value } = e.target;
    setProcessingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcessingSubmit = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7194/api/ProcessingTailor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(processingData),
        }
      );

      const responseData = await response.json();

      if (response.status === 201) {
        await fetchOrders();
        setProcessingDialogOpen(false);
        setError(null);
        alert("Successfully transferred!");
      } else {
        throw new Error(responseData.message || "Failed to process tailor");
      }
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
        `https://localhost:7194/api/Orders/updatestatus/${orderId}`,
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
        `https://localhost:7194/api/Orders/${orderId}`,
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

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) =>
      order?.note?.toLowerCase().includes(searchTerm || "")
    );
  }, [orders, searchTerm]);

  return (
    <div className="manager-dashboard">
      <div className="flex">
        <div className="sidebar">
          <div className="logo">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "160px", height: "auto" }}
            />
            <span className="title">M.</span>
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
                  className={`${location.pathname === "/manager/statistics" ? "active" : ""}`}
                  to="/manager/statistics"
                >
                  <i className="fas fa-chart-bar"></i> Statistics
                </Link>
              </li>
              <li>
                <Link
                  className={`${location.pathname === "/manager/shipment" ? "active" : ""}`}
                  to="/manager/shipment"
                >
                  <i className="fas fa-shipping-fast"></i> Shipment
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
        </div>

        <div className="main-content">
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
                <div className="header">
                  <TextField
                    label="Search by Note"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: "1rem", width: "300px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
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
                      {filteredOrders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            {users[order.userID] || "Unknown"}
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
                            ${order.totalPrice?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            <span
                              style={{
                                backgroundColor: getProcessingStatusColor(
                                  processingStatuses[order.orderId]
                                ),
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "5px",
                                fontSize: "12px",
                              }}
                            >
                              {processingStatuses[order.orderId] ||
                                "Loading..."}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleProcessTailor(order)}
                              disabled={!order}
                            >
                              Process Tailor
                            </Button>
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
                      select
                      value={processingData.stageName}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                    >
                      <MenuItem value="Make Sample">Make Sample</MenuItem>
                      <MenuItem value="Fix">Fix</MenuItem>
                      <MenuItem value="Delivery">Delivery</MenuItem>
                    </TextField>
                    <TextField
                      label="Status"
                      name="status"
                      select
                      value={processingData.status}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                    >
                      <MenuItem value="Doing">Doing</MenuItem>
                      <MenuItem value="Not Start">Not Start</MenuItem>
                      <MenuItem value="Finish">Finish</MenuItem>
                      <MenuItem value="Due">Due</MenuItem>
                      <MenuItem value="Cancel">Cancel</MenuItem>
                    </TextField>
                    <TextField
                      label="Tailor Partner Location"
                      name="tailorPartnerId"
                      select
                      value={processingData.tailorPartnerId}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                    >
                      <MenuItem value="">
                        <em>Select a location</em>
                      </MenuItem>
                      {tailorPartners.map((partner) => (
                        <MenuItem
                          key={partner.tailorPartnerId}
                          value={partner.tailorPartnerId}
                        >
                          {partner.location}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Note"
                      name="note"
                      value={processingData.note}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      label="Date Sample"
                      name="dateSample"
                      type="date"
                      value={processingData.dateSample}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      label="Date Fix"
                      name="dateFix"
                      type="date"
                      value={processingData.dateFix}
                      onChange={handleProcessingChange}
                      fullWidth
                      margin="dense"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      label="Date Delivery"
                      name="dateDelivery"
                      type="date"
                      value={processingData.dateDelivery}
                      onChange={handleProcessingChange}
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
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
