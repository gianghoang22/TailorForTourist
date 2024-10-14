import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const OrderList = () => {
  const orders = [
    { id: 1, customer: 'John Doe', status: 'Pending' },
    { id: 2, customer: 'Jane Smith', status: 'Shipped' },
    // Thêm dữ liệu mẫu ở đây
  ];

  return (
    <List>
      {orders.map((order) => (
        <ListItem key={order.id}>
          <ListItemText primary={`Order ID: ${order.id}`} secondary={`Customer: ${order.customer} - Status: ${order.status}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default OrderList;
