import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Visibility, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const BASE_URL = "https://localhost:7194/api"; // Update this to match your API URL

// Custom styling for components using `styled`
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [formState, setFormState] = useState({
    id: "",
    customerName: "",
    status: "",
    paymentId: "",
    storeId: "",
    voucherId: "",
    shipperPartnerId: "",
    orderDate: "",
    shippedDate: "",
    note: "",
    paid: false,
    totalPrice: "",
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Orders");
      setOrders(response.data);
      setSnackbarMessage("Orders loaded successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
      setSnackbarMessage("Failed to load orders");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    try {
      if (isEditMode) {
        await api.put(`/Orders/${formState.id}`, formState);
        setSnackbarMessage("Order updated successfully");
      } else {
        await api.post("/Orders", formState);
        setSnackbarMessage("Order created successfully");
      }
      setSnackbarSeverity("success");
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage(`Failed to ${isEditMode ? "update" : "create"} order`);
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleEdit = (order) => {
    setFormState(order);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.get(`/Orders/${orderId}`);
      setOrderDetails(response.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSnackbarMessage("Failed to fetch order details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Order Management
      </Typography>

      <StyledButton
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setFormState({
            id: "",
            customerName: "",
            status: "",
            paymentId: "",
            storeId: "",
            voucherId: "",
            shipperPartnerId: "",
            orderDate: "",
            shippedDate: "",
            note: "",
            paid: false,
            totalPrice: "",
          });
          setOpen(true);
          setIsEditMode(false);
        }}
        sx={{ mb: 2 }}
      >
        Add Order
      </StyledButton>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Payment ID</StyledTableCell>
              <StyledTableCell>Order Date</StyledTableCell>
              <StyledTableCell>Shipped Date</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.paymentId}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {order.shippedDate
                    ? new Date(order.shippedDate).toLocaleDateString()
                    : "Pending"}
                </TableCell>{" "}
                {order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}$
                <TableCell>
                  <Tooltip title="Edit Order">
                    <IconButton
                      onClick={() => handleEdit(order)}
                      sx={{ color: "primary.main" }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={() => handleViewDetails(order.id)}
                      sx={{ color: "primary.main" }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit Order Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditMode ? "Edit Order" : "Add Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please fill out the form below to {isEditMode ? "edit" : "add"} an
            order.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Customer Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.customerName}
            onChange={(e) =>
              setFormState({ ...formState, customerName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Order Status"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.status}
            onChange={(e) =>
              setFormState({ ...formState, status: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Total Price"
            type="number"
            fullWidth
            variant="outlined"
            value={formState.totalPrice}
            onChange={(e) =>
              setFormState({
                ...formState,
                totalPrice: parseFloat(e.target.value),
              })
            }
          />
          {/* Add other fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            color="primary"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Order Details */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <div>
              <Typography>
                <strong>Order ID:</strong> {orderDetails.id}
              </Typography>
              <Typography>
                <strong>Customer:</strong> {orderDetails.customerName}
              </Typography>
              <Typography>
                <strong>Status:</strong> {orderDetails.status}
              </Typography>
              <Typography>
                <strong>Payment ID:</strong> {orderDetails.paymentId}
              </Typography>
              <Typography>
                <strong>Order Date:</strong>{" "}
                {new Date(orderDetails.orderDate).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Shipped Date:</strong>{" "}
                {orderDetails.shippedDate
                  ? new Date(orderDetails.shippedDate).toLocaleString()
                  : "Pending"}
              </Typography>
              <Typography>
                <strong>Total Price:</strong> $
                {orderDetails.totalPrice.toFixed(2)}
                console.log(orders); // or the relevant data source
              </Typography>
              <Typography>
                <strong>Note:</strong> {orderDetails.note || "N/A"}
              </Typography>
            </div>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderList;