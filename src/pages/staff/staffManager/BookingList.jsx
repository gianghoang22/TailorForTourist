import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const BookingList = () => {
  const bookings = [
    { id: 1, customer: 'Alice', date: '2024-10-12' },
    { id: 2, customer: 'Bob', date: '2024-10-13' },
    // Thêm dữ liệu mẫu ở đây
  ];

  return (
    <List>
      {bookings.map((booking) => (
        <ListItem key={booking.id}>
          <ListItemText primary={`Booking ID: ${booking.id}`} secondary={`Customer: ${booking.customer} - Date: ${booking.date}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default BookingList;
