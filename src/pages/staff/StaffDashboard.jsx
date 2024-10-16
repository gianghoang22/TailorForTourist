import React from 'react';
import BookingList from './staffManager/BookingList';
import OrderList from './staffManager/OrderList';
import ShipmentList from './staffManager/ShipmentList';
import { Container, Grid, Paper, Typography } from '@mui/material';
import './StaffDashboard.scss';
import Sidebar from '../../layouts/staff/sidebar/Sidebar';

const StaffDashboard = () => {
  return (
    <>
    <Sidebar/>
    <Container className="staff-dashboard">
      <Typography variant="h4" component="h1" gutterBottom>
        Staff Dashboard
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
