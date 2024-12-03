import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';

const UpdateOrderForm = ({ orderId, open, onClose, onUpdateSuccess }) => {
  console.log("UpdateOrderForm props:", { orderId, open }); // Debug log

  const [formData, setFormData] = useState({
    orderId: orderId,
    userID: 0,
    storeId: 0,
    voucherId: 0,
    shipperPartnerId: 0,
    orderDate: "",
    shippedDate: "",
    note: "",
    paid: false,
    status: "",
    guestName: "",
    guestEmail: "",
    guestAddress: "",
    totalPrice: 0,
    deposit: 0,
    shippingFee: 0,
    deliveryMethod: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch current order data
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        console.log("No orderId provided"); // Debug log
        return;
      }
      
      console.log("Fetching order data for ID:", orderId); // Debug log
      try {
        const response = await fetch(`https://localhost:7194/api/Orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order data');
        }
        const data = await response.json();
        console.log("Fetched order data:", data); // Debug log
        setFormData(data);
      } catch (err) {
        console.error("Error fetching order:", err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && open) {
      fetchOrderData();
    }
  }, [orderId, open]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://localhost:7194/api/Orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      setUpdateSuccess(true);
      onUpdateSuccess?.();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.orderId) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Order #{orderId}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Order updated successfully!
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            name="guestName"
            label="Guest Name"
            value={formData.guestName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="guestEmail"
            label="Guest Email"
            value={formData.guestEmail}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="guestAddress"
            label="Guest Address"
            value={formData.guestAddress}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Delivery Method</InputLabel>
            <Select
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleInputChange}
              label="Delivery Method"
            >
              <MenuItem value="Pick up">Pick up</MenuItem>
              <MenuItem value="Delivery">Delivery</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="totalPrice"
            label="Total Price"
            type="number"
            value={formData.totalPrice}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="deposit"
            label="Deposit"
            type="number"
            value={formData.deposit}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="shippingFee"
            label="Shipping Fee"
            type="number"
            value={formData.shippingFee}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="note"
            label="Note"
            value={formData.note}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="paid"
                checked={formData.paid}
                onChange={handleInputChange}
              />
            }
            label="Paid"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateOrderForm; 