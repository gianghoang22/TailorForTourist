import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import OrderList from './OrderList';
import BookingList from './BookingList';
import ShipmentList from './ShipmentList';
import { useLocation, Link } from 'react-router-dom';
import './StaffDashboard.scss';

const StaffDashboard = () => {
  const location = useLocation();
  
  const currentPage = location.pathname.split('/').pop();
  let title, backgroundColor;

  switch (currentPage) {
    case 'order':
      title = 'Order Management';
      backgroundColor = '#e0f7fa';
      break;
    case 'booking':
      title = 'Booking Management';
      backgroundColor = '#f1f8e9';
      break;
    case 'shipment':
      title = 'Shipment Management';
      backgroundColor = '#ffe0b2';
      break;
    default:
      title = 'Staff Dashboard';
      backgroundColor = '#ffffff';
  }

  return (
    <>
      <nav>
        <Link to="/staff/order">Order</Link>
        <Link to="/staff/booking">Booking</Link>
        <Link to="/staff/shipment">Shipment</Link>
      </nav>
      
      <Container className="container" style={{ backgroundColor }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper className="paper">
              <Typography variant="h6" component="h2" gutterBottom>
                Orders
              </Typography>
              <OrderList />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="paper">
              <Typography variant="h6" component="h2" gutterBottom>
                Bookings
              </Typography>
              <BookingList />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="paper">
              <Typography variant="h6" component="h2" gutterBottom>
                Shipments
              </Typography>
              <ShipmentList />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default StaffDashboard;
