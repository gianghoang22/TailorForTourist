import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const BASE_URL = 'http://157.245.50.125:8080/api';

const fetchAllShipments = async () => {
  const response = await fetch(`${BASE_URL}/ShipperPartner`);
  if (!response.ok) {
    throw new Error('Failed to fetch shipments');
  }
  return response.json();
};

const createShipment = async (shipmentData) => {
  const response = await fetch(`${BASE_URL}/ShipperPartner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create shipment');
  }
  return response.json();
};

const updateShipment = async (id, shipmentData) => {
  const response = await fetch(`${BASE_URL}/ShipperPartner/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to update shipment');
  }
  return response.json();
};

const deleteShipment = async (id) => {
  const response = await fetch(`${BASE_URL}/ShipperPartner/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete shipment');
  }
  return response.json();
};

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ id: '', orderId: '', status: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await fetchAllShipments();
        setShipments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteShipment(id);
      setShipments(prevShipments => prevShipments.filter(shipment => shipment.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode) {
        await updateShipment(formState.id, formState);
      } else {
        await createShipment(formState);
      }
      setOpen(false);
      setFormState({ id: '', orderId: '', status: '' });
      const data = await fetchAllShipments();
      setShipments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (shipment) => {
    setFormState(shipment);
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
        Add Shipment
      </Button>
      <List>
        {shipments.map((shipment) => (
          <ListItem key={shipment.id}>
            <ListItemText
              primary={`Shipment ID: ${shipment.shipperPartnerId}`}
              secondary={`
                Shipper Name: ${shipment.shipperPartnerName}
                Phone: ${shipment.phone}
                Company: ${shipment.company}
                Status: ${shipment.status}
              `}
            />
            <Button variant="contained" color="primary" onClick={() => handleEdit(shipment)} style={{ marginRight: '10px' }}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(shipment.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditMode ? 'Edit Shipment' : 'Add Shipment'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to {isEditMode ? 'edit' : 'add'} a shipment.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Shipper ID"
            type="text"
            fullWidth
            value={formState.shipperPartnerId}
            onChange={(e) => setFormState({ ...formState, shipperPartnerId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Shipper's Name"
            type="text"
            fullWidth
            value={formState.shipperPartnerName}
            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Shipper's phone"
            type="number"
            fullWidth
            value={formState.phone}
            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Shipper's Name"
            type="text"
            fullWidth
            value={formState.shipperPartnerName}
            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Company"
            type="text"
            fullWidth
            value={formState.company}
            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
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

export default ShipmentList;
