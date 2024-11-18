import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Edit, Visibility, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const BASE_URL = "https://localhost:7194/api";

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

const fetchAllOrders = async () => {
  const response = await fetch(`${BASE_URL}/Orders`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

const fetchUserNameById = async (userID) => {
  const response = await axios.get(`${BASE_URL}/User/${userID}`);
  return response.data.name;
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);

        // Fetch unique customer names
        const uniqueUserIDs = [...new Set(data.map((order) => order.userID))];
        const userNamesMap = {};
        await Promise.all(
          uniqueUserIDs.map(async (userID) => {
            const name = await fetchUserNameById(userID);
            userNamesMap[userID] = name;
          })
        );
        setUserNames(userNamesMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    // Add createOrder or updateOrder logic here.
  };

  const handleEdit = (order) => {
    setFormState(order);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleViewDetails = async (orderId) => {
    // Add fetchOrderDetails logic here
    setDetailsOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Order Management
      </Typography>

      <StyledButton
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
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
                <TableCell>{userNames[order.userID] || "Loading..."}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.paymentId}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.shippedDate || "Pending"}</TableCell>
                <TableCell>${order.totalPrice}</TableCell>
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
                      onClick={() => handleViewDetails(order.orderId)}
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
              setFormState({ ...formState, totalPrice: e.target.value })
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
          <DialogContentText>
            {orderDetails
              ? JSON.stringify(orderDetails, null, 2)
              : "Loading details..."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderList;
