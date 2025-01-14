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
  Line,
  LineChart,
} from "recharts";
import OrderList from "./staffManager/OrderList";
import BookingList from "./staffManager/BookingList";
import ShipmentList from "./staffManager/ShipmentList";
import MeasureList from "./staffManager/MeasureList";
import CreateAccount from "./staffManager/CreateAccount";
import {
  Search,
  Notifications,
  Mail,
  Dashboard,
  CalendarToday,
  Inbox,
  Group,
  Logout,
  TrendingUp,
  AttachMoney,
  People,
  LocalShipping,
  ThumbUp,
  Timer,
  SwapHoriz,
  MonetizationOn,
  ShoppingCart,
  EventNote,
  LocalMall,
} from "@mui/icons-material";
import "./StaffDashboard.scss";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://vesttour.xyz/api";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("orders");
  const [activeChart, setActiveChart] = useState("orders");
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "bookings") {
      // Set your tab value to the bookings tab
      setTabValue("bookings"); // or whatever value you use for the bookings tab
    }
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
      case "account":
        return <CreateAccount />;
      default:
        return <OrderList />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const StatCard = ({ title, value, icon, change, subtext, positive }) => (
    <div className={`stat-card ${positive ? "positive" : ""}`}>
      <div className="stat-card-header">
        <h3>{title}</h3>
        {icon}
      </div>
      <div className="stat-card-content">
        <p className="value">{value}</p>
        {change && (
          <p className={`change ${positive ? "positive" : "negative"}`}>
            {change}
            {positive ? (
              <TrendingUp />
            ) : (
              <TrendingUp style={{ transform: "rotate(180deg)" }} />
            )}
          </p>
        )}
        {subtext && <p className="subtext">{subtext}</p>}
      </div>
    </div>
  );

  const TabButton = ({ children, active, onClick }) => (
    <button
      className={`tab-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const renderDashboardContent = () => {
    if (activeSection === "dashboard") {
      return (
        <>
          {/* Stats Overview */}
          <div className="stat-cards">
            <StatCard
              title="Total Orders"
              value={orderData.length}
              icon={<ShoppingCart />}
              change="+12%"
              positive
            />
            <StatCard
              title="Active Bookings"
              value={bookingData.length}
              icon={<EventNote />}
              change="+5%"
              positive
            />
            <StatCard
              title="Pending Shipments"
              value={shipmentData.length}
              icon={<LocalShipping />}
              subtext="in progress"
            />
          </div>

          {/* Additional stat cards */}
          <div className="stat-cards">
            <StatCard
              title="Revenue"
              value={`$${totalRevenue}`}
              icon={<MonetizationOn />}
              change="+8%"
              positive
            />
            <StatCard
              title="Customer Satisfaction"
              value="94%"
              icon={<ThumbUp />}
              change="+2%"
              positive
            />
            <StatCard
              title="Processing Time"
              value="2.5 days"
              icon={<Timer />}
              change="-8%"
              positive
            />
          </div>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6">Orders Overview</Typography>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : (
                  <OrderChart data={orderData} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6">Booking Trends</Typography>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : (
                  <BookingChart data={bookingData} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      );
    }

    return renderDetails();
  };

  return (
    <div className={`staff-dashboard ${darkMode ? "dark-mode" : ""}`}>
      <div className="sidebar">
        <div className="logo">
          <Dashboard /> Matcha Vest Staff
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
          <Button
            startIcon={<Group />}
            className={activeSection === "account" ? "active" : ""}
            onClick={() => setActiveSection("account")}
          >
            Create Account
          </Button>
          <Button
            startIcon={<Logout />}
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="main-content">

        <Container maxWidth={false} className="dashboard-content">
          {renderDashboardContent()}
        </Container>
      </div>
    </div>
  );
};

export default StaffDashboard;
