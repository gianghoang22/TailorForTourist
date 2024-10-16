import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const ShipmentList = () => {
  const shipments = [
    { id: 1, orderId: 1, status: 'In Transit' },
    { id: 2, orderId: 2, status: 'Delivered' },
    // Thêm dữ liệu mẫu ở đây
  ];

  return (
    <List>
      {shipments.map((shipment) => (
        <ListItem key={shipment.id}>
          <ListItemText primary={`Shipment ID: ${shipment.id}`} secondary={`Order ID: ${shipment.orderId} - Status: ${shipment.status}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default ShipmentList;
