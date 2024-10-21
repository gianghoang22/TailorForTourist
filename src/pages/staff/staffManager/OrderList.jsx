import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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

const deleteOrder = async (id) => {
  const response = await fetch(`${BASE_URL}/Orders/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
  return response.json();
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ id: '', customerName: '', status: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode) {
        await updateOrder(formState.id, formState);
      } else {
        await createOrder(formState);
      }
      setOpen(false);
      setFormState({ id: '', customerName: '', status: '' });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => { setOpen(true); setIsEditMode(false); }}>
        Add Order
      </Button>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Order ID: ${order.orderId}`}
              secondary={(
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
            )}
          />

            <Button variant="contained" color="primary" onClick={() => handleEdit(order)} style={{ marginRight: '10px' }}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(order.id)}>
              Delete
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
    
    {/* Customer Name */}
    <TextField
      autoFocus
      margin="dense"
      label="Customer Name"
      type="text"
      fullWidth
      value={formState.customerName}
      onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
    />
    
    {/* Status */}
    <TextField
      margin="dense"
      label="Status"
      type="text"
      fullWidth
      value={formState.status}
      onChange={(e) => setFormState({ ...formState, status: e.target.value })}
    />

    {/* Payment ID */}
    <TextField
      margin="dense"
      label="Payment ID"
      type="number"
      fullWidth
      value={formState.paymentId}
      onChange={(e) => setFormState({ ...formState, paymentId: e.target.value })}
    />

    {/* Store ID */}
    <TextField
      margin="dense"
      label="Store ID"
      type="number"
      fullWidth
      value={formState.storeId}
      onChange={(e) => setFormState({ ...formState, storeId: e.target.value })}
    />

    {/* Voucher ID */}
    <TextField
      margin="dense"
      label="Voucher ID"
      type="number"
      fullWidth
      value={formState.voucherId}
      onChange={(e) => setFormState({ ...formState, voucherId: e.target.value })}
    />

    {/* Shipper Partner ID */}
    <TextField
      margin="dense"
      label="Shipper Partner ID"
      type="number"
      fullWidth
      value={formState.shipperPartnerId}
      onChange={(e) => setFormState({ ...formState, shipperPartnerId: e.target.value })}
    />

    {/* Order Date */}
    <TextField
      margin="dense"
      label="Order Date"
      type="date"
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      value={formState.orderDate}
      onChange={(e) => setFormState({ ...formState, orderDate: e.target.value })}
    />

    {/* Shipped Date */}
    <TextField
      margin="dense"
      label="Shipped Date"
      type="date"
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      value={formState.shippedDate}
      onChange={(e) => setFormState({ ...formState, shippedDate: e.target.value })}
    />

    {/* Note */}
    <TextField
      margin="dense"
      label="Note"
      type="text"
      fullWidth
      value={formState.note}
      onChange={(e) => setFormState({ ...formState, note: e.target.value })}
    />

    {/* Paid */}
    <TextField
      margin="dense"
      label="Paid"
      type="checkbox"
      checked={formState.paid}
      onChange={(e) => setFormState({ ...formState, paid: e.target.checked })}
    />

    {/* Total Price */}
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
      {isEditMode ? 'Update' : 'Add'}
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default OrderList;
