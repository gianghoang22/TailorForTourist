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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Edit, Visibility, Add, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import UpdateOrderForm from './UpdateOrderForm';

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
  const [updateOrderId, setUpdateOrderId] = useState(null);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [linings, setLinings] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [createOrderForm, setCreateOrderForm] = useState({
    userID: 2,
    storeId: 1,
    voucherId: 16,
    shipperPartnerId: 1,
    shippedDate: "",
    note: "",
    paid: true,
    deposit: 0,
    shippingFee: 0,
    deliveryMethod: "Pick up",
    products: [],
    customProducts: []
  });
  const [stores, setStores] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [shippers, setShippers] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        const [
          usersRes,
          storesRes, 
          vouchersRes,
          shippersRes,
          productsRes,
          fabricsRes,
          liningsRes,
          styleOptionsRes
        ] = await Promise.all([
          api.get("/User"),
          api.get("/Store"),
          api.get("/Voucher/valid"),
          api.get("/ShipperPartner"),
          api.get("/Product/products/custom-false"),
          api.get("/Fabrics"),
          api.get("/Linings"),
          api.get("/StyleOption")
        ]);

        setUsers(usersRes.data);
        setStores(storesRes.data);
        setVouchers(vouchersRes.data);
        setShippers(shippersRes.data);
        setProducts(productsRes.data);
        setFabrics(fabricsRes.data);
        setLinings(liningsRes.data);
        setStyleOptions(styleOptionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Failed to load required data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchRequiredData();
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
    setUpdateOrderId(order.id);
    setUpdateFormOpen(true);
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

  const handleUpdateSuccess = () => {
    fetchOrders(); // Refresh the orders list
  };

  const handleCreateOrderSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/Orders/staffcreateorder", createOrderForm);
      setSnackbarMessage("Order created successfully");
      setSnackbarSeverity("success");
      setOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error creating order:", error);
      setSnackbarMessage("Failed to create order");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const CreateOrderDialog = () => (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Create New Order</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Basic Order Information */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={createOrderForm.userID}
                onChange={(e) => setCreateOrderForm({
                  ...createOrderForm,
                  userID: e.target.value
                })}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.userName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Store</InputLabel>
              <Select
                value={createOrderForm.storeId}
                onChange={(e) => setCreateOrderForm({
                  ...createOrderForm,
                  storeId: e.target.value
                })}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Voucher</InputLabel>
              <Select
                value={createOrderForm.voucherId}
                onChange={(e) => setCreateOrderForm({
                  ...createOrderForm,
                  voucherId: e.target.value
                })}
              >
                {vouchers.map((voucher) => (
                  <MenuItem key={voucher.id} value={voucher.id}>
                    {voucher.code} - {voucher.discountAmount}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Shipper Partner</InputLabel>
              <Select
                value={createOrderForm.shipperPartnerId}
                onChange={(e) => setCreateOrderForm({
                  ...createOrderForm,
                  shipperPartnerId: e.target.value
                })}
              >
                {shippers.map((shipper) => (
                  <MenuItem key={shipper.id} value={shipper.id}>
                    {shipper.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Guest Information */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Guest Name"
              value={createOrderForm.guestName}
              onChange={(e) => setCreateOrderForm({
                ...createOrderForm,
                guestName: e.target.value
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Guest Email"
              value={createOrderForm.guestEmail}
              onChange={(e) => setCreateOrderForm({
                ...createOrderForm,
                guestEmail: e.target.value
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Guest Address"
              value={createOrderForm.guestAddress}
              onChange={(e) => setCreateOrderForm({
                ...createOrderForm,
                guestAddress: e.target.value
              })}
            />
          </Grid>

          {/* Order Details */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Deposit"
              value={createOrderForm.deposit}
              onChange={(e) => setCreateOrderForm({
                ...createOrderForm,
                deposit: parseFloat(e.target.value)
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Shipping Fee"
              value={createOrderForm.shippingFee}
              onChange={(e) => setCreateOrderForm({
                ...createOrderForm,
                shippingFee: parseFloat(e.target.value)
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Delivery Method</InputLabel>
              <Select
                value={createOrderForm.deliveryMethod}
                onChange={(e) => setCreateOrderForm({
                  ...createOrderForm,
                  deliveryMethod: e.target.value
                })}
              >
                <MenuItem value="Pick up">Pick up</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Note"
              value={createOrderForm.note}
              onChange={(e) => setCreateOrderForm({
                ...createOrderForm,
                note: e.target.value
              })}
            />
          </Grid>

          {/* Regular Products Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Products</Typography>
            <Button
              variant="outlined"
              onClick={() => setCreateOrderForm({
                ...createOrderForm,
                products: [...createOrderForm.products, {
                  productID: 0,
                  productCode: "",
                  measurementID: 0,
                  categoryID: 0,
                  fabricID: 0,
                  liningID: 0,
                  size: "",
                  quantity: 1,
                  isCustom: false,
                  imgURL: "",
                  price: 0
                }]
              })}
            >
              Add Product
            </Button>

            {createOrderForm.products.map((product, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={product.productID}
                      onChange={(e) => {
                        const newProducts = [...createOrderForm.products];
                        const selectedProduct = products.find(p => p.id === e.target.value);
                        newProducts[index] = {
                          ...newProducts[index],
                          productID: e.target.value,
                          productCode: selectedProduct?.code || '',
                          price: selectedProduct?.price || 0
                        };
                        setCreateOrderForm({
                          ...createOrderForm,
                          products: newProducts
                        });
                      }}
                    >
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name} - ${p.price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Size"
                    value={product.size}
                    onChange={(e) => {
                      const newProducts = [...createOrderForm.products];
                      newProducts[index].size = e.target.value;
                      setCreateOrderForm({
                        ...createOrderForm,
                        products: newProducts
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={product.quantity}
                    onChange={(e) => {
                      const newProducts = [...createOrderForm.products];
                      newProducts[index].quantity = parseInt(e.target.value);
                      setCreateOrderForm({
                        ...createOrderForm,
                        products: newProducts
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    disabled
                    label="Price"
                    value={`$${product.price}`}
                  />
                </Grid>

                <Grid item xs={1}>
                  <IconButton
                    onClick={() => {
                      const newProducts = createOrderForm.products.filter((_, i) => i !== index);
                      setCreateOrderForm({
                        ...createOrderForm,
                        products: newProducts
                      });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* Custom Products Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Custom Products</Typography>
            <Button
              variant="outlined"
              onClick={() => setCreateOrderForm({
                ...createOrderForm,
                customProducts: [...createOrderForm.customProducts, {
                  categoryID: 5,
                  fabricID: "",
                  liningID: "",
                  measurementID: "",
                  quantity: 1,
                  pickedStyleOptions: []
                }]
              })}
            >
              Add Custom Product
            </Button>

            {createOrderForm.customProducts.map((customProduct, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Fabric</InputLabel>
                    <Select
                      value={customProduct.fabricID}
                      onChange={(e) => {
                        const newCustomProducts = [...createOrderForm.customProducts];
                        newCustomProducts[index].fabricID = e.target.value;
                        setCreateOrderForm({
                          ...createOrderForm,
                          customProducts: newCustomProducts
                        });
                      }}
                    >
                      {fabrics.map((fabric) => (
                        <MenuItem key={fabric.id} value={fabric.id}>
                          {fabric.name} - ${fabric.price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Lining</InputLabel>
                    <Select
                      value={customProduct.liningID}
                      onChange={(e) => {
                        const newCustomProducts = [...createOrderForm.customProducts];
                        newCustomProducts[index].liningID = e.target.value;
                        setCreateOrderForm({
                          ...createOrderForm,
                          customProducts: newCustomProducts
                        });
                      }}
                    >
                      {linings.map((lining) => (
                        <MenuItem key={lining.id} value={lining.id}>
                          {lining.name} - ${lining.price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel>Style Options</InputLabel>
                    <Select
                      multiple
                      value={customProduct.pickedStyleOptions.map(option => option.styleOptionID)}
                      onChange={(e) => {
                        const newCustomProducts = [...createOrderForm.customProducts];
                        newCustomProducts[index].pickedStyleOptions = e.target.value.map(id => ({
                          styleOptionID: id
                        }));
                        setCreateOrderForm({
                          ...createOrderForm,
                          customProducts: newCustomProducts
                        });
                      }}
                    >
                      {styleOptions.map((style) => (
                        <MenuItem key={style.id} value={style.id}>
                          {style.name} - ${style.price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={1}>
                  <IconButton
                    onClick={() => {
                      const newCustomProducts = createOrderForm.customProducts.filter((_, i) => i !== index);
                      setCreateOrderForm({
                        ...createOrderForm,
                        customProducts: newCustomProducts
                      });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleCreateOrderSubmit} variant="contained" color="primary">
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );

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

      <Button
        onClick={() => {
          console.log("Test button clicked");
          setUpdateOrderId(1); // Test với mt ID cụ thể
          setUpdateFormOpen(true);
        }}
      >
        Test Update Form
      </Button>

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

      <UpdateOrderForm
        orderId={updateOrderId}
        open={updateFormOpen}
        onClose={() => setUpdateFormOpen(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default OrderList;