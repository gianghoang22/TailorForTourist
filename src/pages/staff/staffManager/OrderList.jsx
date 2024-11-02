import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const BASE_URL = 'https://localhost:7194/api';

const fetchAllOrders = async () => {
  const response = await fetch(`${BASE_URL}/Orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

const createOrder = async (orderData) => {
  const response = await fetch(`${BASE_URL}/Orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
};

const updateOrder = async (id, orderData) => {
  const response = await fetch(`${BASE_URL}/Orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to update order');
  }
  return response.json();
};

const fetchStores = async () => {
  const response = await fetch(`${BASE_URL}/Store`);
  if (!response.ok) {
    throw new Error('Failed to fetch stores');
  }
  return response.json();
};

const fetchPayments = async () => {
  const response = await fetch(`${BASE_URL}/Payments`);
  if (!response.ok) {
    throw new Error('Failed to fetch payments');
  }
  return response.json();
};

const fetchVouchers = async () => {
  const response = await fetch(`${BASE_URL}/Voucher`);
  if (!response.ok) {
    throw new Error('Failed to fetch vouchers');
  }
  return response.json();
};

const fetchShippers = async () => {
  const response = await fetch(`${BASE_URL}/ShipperPartner`);
  if (!response.ok) {
    throw new Error('Failed to fetch shippers');
  }
  return response.json();
};

const fetchOrderDetails = async (orderId) => {
  const response = await fetch(`${BASE_URL}/Orders/${orderId}/details`);
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  return response.json();
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [payments, setPayments] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formState, setFormState] = useState({
    id: '',
    customerName: '',
    status: '',
    paymentId: '',
    storeId: '',
    voucherId: '',
    shipperPartnerId: '',
    orderDate: '',
    shippedDate: '',
    note: '',
    paid: false,
    totalPrice: '',
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
        const storeData = await fetchStores();
        setStores(storeData);
        const paymentData = await fetchPayments();
        setPayments(paymentData);
        const voucherData = await fetchVouchers();
        setVouchers(voucherData);
        const shipperData = await fetchShippers();
        setShippers(shipperData);
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
    if (
      !formState.customerName ||
      !formState.status ||
      !formState.paymentId ||
      !formState.storeId ||
      !formState.voucherId ||
      !formState.shipperPartnerId ||
      !formState.orderDate ||
      !formState.totalPrice
    ) {
      setError('All fields are required');
      return;
    }

    try {
      if (isEditMode) {
        await updateOrder(formState.id, formState);
      } else {
        await createOrder(formState);
      }
      setOpen(false);
      setFormState({
        id: '',
        customerName: '',
        status: '',
        paymentId: '',
        storeId: '',
        voucherId: '',
        shipperPartnerId: '',
        orderDate: '',
        shippedDate: '',
        note: '',
        paid: false,
        totalPrice: '',
      });
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (order) => {
    setFormState(order);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleViewDetails = async (orderId) => {
    try {
      const data = await fetchOrderDetails(orderId);
      setOrderDetails(data);
      setDetailsOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
          setIsEditMode(false);
        }}
      >
        Add Order
      </Button>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Order ID: ${order.orderId}`}
              secondary={
                <>
                  <div>Customer: {order.customerName}</div>
                  <div>Status: {order.status}</div>
                  <div>Payment ID: {order.paymentId}</div>
                  <div>Store ID: {order.storeId}</div>
                  <div>Voucher ID: {order.voucherId}</div>
                  <div>Shipper Partner ID: {order.shipperPartnerId}</div>
                  <div>Order Date: {order.orderDate}</div>
                  <div>Shipped Date: {order.shippedDate}</div>
                  <div>Note: {order.note}</div>
                  <div>Paid: {order.paid ? 'Yes' : 'No'}</div>
                  <div>Total Price: ${order.totalPrice}</div>
                </>
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit(order)}
              style={{ marginRight: '10px' }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleViewDetails(order.id)}
            >
              View Details
            </Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditMode ? 'Edit Order' : 'Add Order'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to {isEditMode ? 'edit' : 'add'} an order.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Customer Name"
            type="text"
            fullWidth
            value={formState.customerName}
            onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            value={formState.status}
            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment</InputLabel>
            <Select
              value={formState.paymentId}
              onChange={(e) => setFormState({ ...formState, paymentId: e.target.value })}
            >
              {payments.map((payment) => (
                <MenuItem key={payment.id} value={payment.id}>
                  {payment.method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Store</InputLabel>
            <Select
              value={formState.storeId}
              onChange={(e) => setFormState({ ...formState, storeId: e.target.value })}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Voucher</InputLabel>
            <Select
              value={formState.voucherId}
              onChange={(e) => setFormState({ ...formState, voucherId: e.target.value })}
            >
              {vouchers.map((voucher) => (
                <MenuItem key={voucher.id} value={voucher.id}>
                  {voucher.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Shipper Partner</InputLabel>
            <Select
              value={formState.shipperPartnerId}
              onChange={(e) => setFormState({ ...formState, shipperPartnerId: e.target.value })}
            >
              {shippers.map((shipper) => (
                <MenuItem key={shipper.id} value={shipper.id}>
                  {shipper.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Order Date"
            type="date"
            fullWidth
            value={formState.orderDate}
            onChange={(e) => setFormState({ ...formState, orderDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Shipped Date"
            type="date"
            fullWidth
            value={formState.shippedDate}
            onChange={(e) => setFormState({ ...formState, shippedDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            value={formState.note}
            onChange={(e) => setFormState({ ...formState, note: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.paid}
                onChange={(e) => setFormState({ ...formState, paid: e.target.checked })}
              />
            }
            label="Paid"
          />
          <TextField
            margin="dense"
            label="Total Price"
            type="number"
            fullWidth
            value={formState.totalPrice}
            onChange={(e) => setFormState({ ...formState, totalPrice: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <div>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Customer Name:</strong> {orderDetails.customerName}</p>
              <p><strong>Status:</strong> {orderDetails.status}</p>
              <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
              <p><strong>Store Name:</strong> {orderDetails.storeName}</p>
              <p><strong>Shipper Partner:</strong> {orderDetails.shipperPartner}</p>
              <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
              <p><strong>Shipped Date:</strong> {orderDetails.shippedDate || 'Pending'}</p>
              <p><strong>Notes:</strong> {orderDetails.note || 'No notes'}</p>
              <p><strong>Paid:</strong> {orderDetails.paid ? 'Yes' : 'No'}</p>
              <p><strong>Total Price:</strong> ${orderDetails.totalPrice}</p>
            </div>
          ) : (
            <div>Loading details...</div>
          )}
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
