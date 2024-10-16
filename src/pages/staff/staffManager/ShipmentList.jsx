import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';

const BASE_URL = 'https://localhost:7244/api';

const fetchAllShipments = async () => {
  const response = await fetch(`${BASE_URL}/ShipperPartner`);
  if (!response.ok) {
    throw new Error('Failed to fetch shipments');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <List>
        {shipments.map((shipment) => (
          <ListItem key={shipment.id}>
            <ListItemText
              primary={`Shipment ID: ${shipment.id}`}
              secondary={`Order ID: ${shipment.orderId} - Status: ${shipment.status}`}
            />
            <Button variant="contained" color="secondary" onClick={() => handleDelete(shipment.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ShipmentList;
