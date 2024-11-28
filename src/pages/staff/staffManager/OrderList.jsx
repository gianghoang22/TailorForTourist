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
  MenuItem,
  Select,
  Box,
  Chip,
  Menu,
} from "@mui/material";
import { Edit, Visibility, Add, KeyboardArrowDown } from "@mui/icons-material";
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

// Thêm object để quản lý màu sắc của status
const statusColors = {
  Pending: '#ffd700',    // Vàng
  Processing: '#1976d2', // Xanh dương
  Finish: '#4caf50',     // Xanh lá
  Cancel: '#f44336',     // Đỏ
  Ready: '#ff9800'       // Cam
};

const ORDER_STATUSES = ["Pending", "Processing", "Finish", "Cancel", "Ready"];

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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Orders");
      
      // Fetch user details for each order
      const ordersWithUserNames = await Promise.all(
        response.data.map(async (order) => {
          try {
            const userResponse = await api.get(`/User/${order.userID}`);
            return {
              ...order,
              customerName: userResponse.data.name
            };
          } catch (err) {
            console.error(`Error fetching user details for ID ${order.userID}:`, err);
            return {
              ...order,
              customerName: 'Guest'
            };
          }
        })
      );

      setOrders(ordersWithUserNames);
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

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setAnchorEl(null);
      setSelectedOrderId(orderId);
      setSelectedStatus(status);
      setConfirmDialogOpen(true);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      const response = await api.patch(
        `/Orders/updatestatus/${selectedOrderId}`,
        JSON.stringify(selectedStatus), // selectedStatus sẽ là một trong các giá trị của ORDER_STATUSES
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setOrders(orders.map(order => 
          order.orderId === selectedOrderId 
            ? { ...order, status: selectedStatus }
            : order
        ));

        setSnackbarMessage("Cập nhật trạng thái thành công");
        setSnackbarSeverity("success");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      setSnackbarMessage("Lỗi khi cập nhật trạng thái");
      setSnackbarSeverity("error");
    } finally {
      setConfirmDialogOpen(false);
      setSnackbarOpen(true);
      setSelectedOrderId(null);
      setSelectedStatus(null);
    }
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
              <TableRow key={order.orderId} hover>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customerName || 'Không xác định'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={order.status}
                      sx={{
                        bgcolor: statusColors[order.status],
                        color: ['Processing', 'Cancel'].includes(order.status) ? 'white' : 'black',
                        fontWeight: 'bold'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
                        setSelectedOrderId(order.orderId);
                        setAnchorEl(event.currentTarget);
                      }}
                    >
                      <KeyboardArrowDown />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedOrderId === order.orderId}
                      onClose={() => setAnchorEl(null)}
                      MenuListProps={{
                        'aria-labelledby': 'status-button',
                      }}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <MenuItem 
                          key={status} 
                          onClick={() => handleStatusUpdate(order.orderId, status)}
                          selected={status === order.status}
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </TableCell>
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

      {/* Dialog xác nhận */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Xác nhận thay đổi trạng thái
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "{selectedStatus}" không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirmStatusUpdate} variant="contained">
            Xác nhận
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
