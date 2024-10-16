import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';

const BASE_URL = 'https://localhost:7244/api';

const fetchAllOrders = async () => {
  const response = await fetch(`${BASE_URL}/Orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Order ID: ${order.id}`}
              secondary={`Customer: ${order.customerName} - Status: ${order.status}`}
            />
            <Button variant="contained" color="secondary" onClick={() => handleDelete(order.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default OrderList;
