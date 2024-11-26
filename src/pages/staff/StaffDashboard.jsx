import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import OrderList from "./staffManager/OrderList";
import BookingList from "./staffManager/BookingList";
import ShipmentList from "./staffManager/ShipmentList";
import MeasureList from "./staffManager/MeasureList";
import {
  Search,
  Notifications,
  Mail,
  Dashboard,
  CalendarToday,
  Inbox,
  Group,
} from "@mui/icons-material";
import "./StaffDashboard.scss";

const BASE_URL = "https://localhost:7194/api";

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [darkMode, setDarkMode] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [shipmentData, setShipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(`${BASE_URL}/Orders`);
        setOrderData(ordersResponse.data);

        const bookingsResponse = await axios.get(`${BASE_URL}/Booking`);
        const bookingData = bookingsResponse.data;

        // Check if bookingData is an object with a 'data' property
        if (
          typeof bookingData === "object" &&
          bookingData !== null &&
          "data" in bookingData
        ) {
          // Transform booking data to count bookings per day
          const bookingCountByDate = bookingData.data.reduce((acc, booking) => {
            const date = booking.bookingDate.split("T")[0]; // Assuming bookingDate is in ISO format
            if (!acc[date]) {
              acc[date] = { date, count: 0 };
            }
            acc[date].count += 1;
            return acc;
          }, {});

          setBookingData(Object.values(bookingCountByDate));
        } else {
          console.error("Unexpected bookings data structure:", bookingData);
          setBookingData([]);
        }

        const shipmentsResponse = await axios.get(`${BASE_URL}/ShipperPartner`);
        setShipmentData(shipmentsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderDetails = () => {
    switch (activeSection) {
      case "orders":
        return <OrderList />;
      case "bookings":
        return <BookingList />;
      case "shipments":
        return <ShipmentList />;
      case "measure":
        return <MeasureList />;
      default:
        return <OrderList />;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`staff-dashboard ${darkMode ? "dark-mode" : ""}`}>
      <Grid container>
        {/* Sidebar */}
        <Grid item xs={12} md={2} className="sidebar">
          <div className="logo">
            <Dashboard /> EmployeeHub
          </div>
          <div className="menu-items">
            <Button
              startIcon={<Dashboard />}
              className={activeSection === "orders" ? "active" : ""}
              onClick={() => setActiveSection("orders")}
            >
              Orders
            </Button>
            <Button
              startIcon={<CalendarToday />}
              className={activeSection === "bookings" ? "active" : ""}
              onClick={() => setActiveSection("bookings")}
            >
              Bookings
            </Button>
            <Button
              startIcon={<Inbox />}
              className={activeSection === "shipments" ? "active" : ""}
              onClick={() => setActiveSection("shipments")}
            >
              Shipments
            </Button>
            <Button
              startIcon={<Group />}
              className={activeSection === "measure" ? "active" : ""}
              onClick={() => setActiveSection("measure")}
            >
              Measurement
            </Button>
          </div>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={10} className="main-content">
          {/* Header */}
          <Paper className="header" elevation={0}>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <div className="header-actions">
              <Button startIcon={<Search />}>Search</Button>
              <Button startIcon={<Notifications />}>Notifications</Button>
              <Button startIcon={<Mail />}>Messages</Button>
              <Button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </Paper>

          {/* Dashboard Content */}
          <Container maxWidth={false} className="dashboard-content">
            <Grid container spacing={3}>
              {/* Charts */}
              <Grid item xs={12} md={4}>
                <Paper className="chart-container">
                  <Typography variant="h6">Orders</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="orderDate" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalPrice" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className="chart-container">
                  <Typography variant="h6">Bookings</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />{" "}
                      {/* Updated to match bookingData structure */}
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />{" "}
                      {/* Updated to match bookingData structure */}
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className="chart-container">
                  <Typography variant="h6">Shipments</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={shipmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="shipmentDate" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="shipmentCount" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Section for detailed view (CRUD operations) */}
              <Grid item xs={12}>
                <Paper className="details-container">{renderDetails()}</Paper>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default StaffDashboard;
