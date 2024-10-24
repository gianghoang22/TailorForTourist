import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import OrderList from './staffManager/OrderList';
import BookingList from './staffManager/BookingList';
import ShipmentList from './staffManager/ShipmentList'; 
import MeasureList from './staffManager/MeasureList';
import './StaffDashboard.scss';

// Sample data for the charts
const orderData = [
  { name: 'Jan', orders: 30 },
  { name: 'Feb', orders: 45 },
  { name: 'Mar', orders: 60 },
  { name: 'Apr', orders: 50 },
];

const bookingData = [
  { name: 'Jan', bookings: 20 },
  { name: 'Feb', bookings: 35 },
  { name: 'Mar', bookings: 50 },
  { name: 'Apr', bookings: 40 },
];

const shipmentData = [
  { name: 'Jan', shipments: 15 },
  { name: 'Feb', shipments: 25 },
  { name: 'Mar', shipments: 40 },
  { name: 'Apr', shipments: 30 },
];

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState('orders'); // State to manage which section (Order, Booking, Shipment) is active

  // Simulating user data
  const userProfile = {
    name: "Quỳnh Anh",
    role: "Staff Member",
    avatarUrl: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-1/371822325_1772724073179997_3688819987814441135_n.jpg?stp=dst-jpg_s200x200&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=jMOpuqPO93EQ7kNvgHIjWhw&_nc_zt=24&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AMz5xWWL0ytarIFTkSBwpj5&oh=00_AYCo4V6xp3TV7A8sbxQZvnIhDkbFicHdCFRHvAVCY5Dkiw&oe=67166B47", // Replace with the user's real avatar URL
  };

  // Function to render the detailed section based on the active button
  const renderDetails = () => {
    switch (activeSection) {
      case 'orders':
        return <OrderList />;
      case 'bookings':
        return <BookingList />;
      case 'shipments':
        return <ShipmentList />;
      case 'measure':
        return <MeasureList />;
      default:
        return <OrderList />;
    }
  };

  return (
    <Container className="staff-dashboard">
      <Grid container spacing={3}>
        {/* Sidebar Section */}
        <Grid item xs={12} md={3}>
          <Paper className="sidebar">
            {/* User Profile */}
            <div className="user-profile">
              <Avatar alt={userProfile.name} src={userProfile.avatarUrl} sx={{ width: 80, height: 80 }} />
              <Typography variant="h6" component="h2">
                {userProfile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userProfile.role}
              </Typography>
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              <Button
                fullWidth
                variant={activeSection === 'orders' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('orders')}
              >
                Orders
              </Button>
              <Button
                fullWidth
                variant={activeSection === 'bookings' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('bookings')}
              >
                Bookings
              </Button>
              <Button
                fullWidth
                variant={activeSection === 'shipments' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('shipments')}
              >
                Shipments
              </Button>
              <Button
                fullWidth
                variant={activeSection === 'measure' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('measure')}
              >
                Measurement
              </Button>
            </div>
          </Paper>
        </Grid>

        {/* Main Content Section */}
        <Grid item xs={12} md={9}>
          {/* Charts */}
          <Grid container spacing={3}>
            {/* Orders Chart */}
            <Grid item xs={12} md={4}>
              <Paper className="paper">
                <Typography variant="h6" component="h2" gutterBottom>
                  Orders
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Bookings Chart */}
            <Grid item xs={12} md={4}>
              <Paper className="paper">
                <Typography variant="h6" component="h2" gutterBottom>
                  Bookings
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Shipments Chart */}
            <Grid item xs={12} md={4}>
              <Paper className="paper">
                <Typography variant="h6" component="h2" gutterBottom>
                  Shipments
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shipmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="shipments" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Section for detailed view (CRUD operations) */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="paper">
                {/* Show the details section for CRUD operations */}
                {renderDetails()}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StaffDashboard;
