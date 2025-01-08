import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Bar } from "react-chartjs-2";
import {
  CalendarIcon,
  TrendingUpIcon,
  FilterIcon,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import "./BookingManagement.scss";
import { motion } from "framer-motion";
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";

const BASE_URL = "https://vesttour.xyz/api";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "#66bb6a"; // Green
    case "pending":
      return "#ffa726"; // Orange
    case "cancel":
      return "#ef5350"; // Red
    default:
      return "#9e9e9e"; // Grey
  }
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 7; // Number of bookings per page
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [monthlyStats, setMonthlyStats] = useState({
    totalBookings: 0,
    averageMonthly: 0,
    peakMonth: "",
    peakBookings: 0,
    monthlyData: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchStoreByManagerId = async (userId) => {
    const response = await fetch(`${BASE_URL}/Store/userId/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch store");
    }
    return response.json();
  };

  const fetchBookingsByStoreId = async (storeId) => {
    const response = await fetch(`${BASE_URL}/Booking/booking/${storeId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  };

  const filterBookings = (bookings) => {
    const now = new Date();
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      const bookingYear = bookingDate.getFullYear();
      let dateMatch = bookingYear === selectedYear; // First filter by year

      if (!dateMatch) return false;

      switch (dateFilter) {
        case "today":
          dateMatch = bookingDate.toDateString() === now.toDateString();
          break;
        case "thisWeek":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          dateMatch = bookingDate >= startOfWeek && bookingDate <= endOfWeek;
          break;
        case "thisMonth":
          dateMatch = bookingDate.getMonth() === now.getMonth();
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          dateMatch = bookingDate.getMonth() === lastMonth.getMonth();
          break;
        case "custom":
          if (customDateRange.startDate && customDateRange.endDate) {
            dateMatch =
              bookingDate >= customDateRange.startDate &&
              bookingDate <= customDateRange.endDate;
          }
          break;
        default:
          dateMatch = true;
      }

      return dateMatch;
    });
  };

  const processMonthlyData = (bookings) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyBookings = new Array(12).fill(0);

    bookings.forEach((booking) => {
      const bookingYear = new Date(booking.bookingDate).getFullYear();
      if (bookingYear === selectedYear) {
        const month = new Date(booking.bookingDate).getMonth();
        monthlyBookings[month]++;
      }
    });

    const totalBookings = bookings.filter((booking) => {
      const bookingYear = new Date(booking.bookingDate).getFullYear();
      return bookingYear === selectedYear;
    }).length;

    const peakMonth =
      months[monthlyBookings.indexOf(Math.max(...monthlyBookings))];

    setMonthlyStats({
      totalBookings,
      averageMonthly: (totalBookings / 12).toFixed(1),
      peakMonth,
      peakBookings: Math.max(...monthlyBookings),
      monthlyData: monthlyBookings,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const storeData = await fetchStoreByManagerId(userId);
      const bookingsData = await fetchBookingsByStoreId(storeData.storeId);
      const bookingsArray = Array.isArray(bookingsData)
        ? bookingsData
        : [bookingsData];
      setBookings(bookingsArray);
      processMonthlyData(bookingsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          throw new Error("User ID not found");
        }
        const storeData = await fetchStoreByManagerId(userId);
        const bookingsData = await fetchBookingsByStoreId(storeData.storeId);
        const bookingsArray = Array.isArray(bookingsData)
          ? bookingsData
          : [bookingsData];
        setBookings(bookingsArray);
        processMonthlyData(bookingsArray);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Sort bookings by bookingId descending
  const sortedBookings = [...bookings].sort(
    (a, b) => b.bookingId - a.bookingId
  );
  const filteredBookings = filterBookings(sortedBookings);

  // Calculate the current bookings to display
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

  // Add the chart data configuration
  const bookingChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Number of Bookings",
        data: monthlyStats.monthlyData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Booking Statistics for ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  // Add search filter
  const filteredAndSearchedBookings = filteredBookings.filter(
    (booking) =>
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toString().includes(searchTerm)
  );

  // Add useEffect to update data when year changes
  useEffect(() => {
    if (bookings.length > 0) {
      processMonthlyData(bookings);
    }
  }, [selectedYear, bookings]); // Add selectedYear as a dependency

  // Update the year filter handler
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
    setCurrentPage(1); // Reset to first page when year changes
  };

  // Add clear filters function
  const handleClearFilters = () => {
    setDateFilter("all");
    setCustomDateRange({
      startDate: null,
      endDate: null,
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="booking-management"
    >
      {/* Statistics Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="booking-statistics"
      >
        <div className="year-filter-container">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="year-filter"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div className="stat-cards">
          {[
            {
              title: "Total Bookings",
              value: monthlyStats.totalBookings,
              subtext: `for ${selectedYear}`,
              icon: <CalendarIcon />,
              color: "#4CAF50",
            },
            {
              title: "Average Monthly Bookings",
              value: monthlyStats.averageMonthly,
              subtext: "per month",
              icon: <CalendarIcon />,
              color: "#2196F3",
            },
            {
              title: "Peak Booking Month",
              value: monthlyStats.peakMonth,
              subtext: `${monthlyStats.peakBookings} bookings`,
              icon: <TrendingUpIcon />,
              color: "#FF9800",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ borderTop: `4px solid ${stat.color}` }}
            >
              <div className="stat-card-header">
                <h3>{stat.title}</h3>
                {stat.icon}
              </div>
              <div className="stat-card-content">
                <p className="value">{stat.value}</p>
                <p className="subtext">{stat.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="chart-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Bar data={bookingChartData} options={chartOptions} />
        </motion.div>
      </motion.div>

      {/* Header Section */}
      <motion.div
        className="header-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="header">
          <Typography variant="h4">Booking Management</Typography>
          <div className="header-actions">
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                className={isRefreshing ? "spinning" : ""}
              >
                <RefreshCcw />
              </IconButton>
            </Tooltip>
            <Link to="/manager" className="back-link">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="search-filter-section">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            className="search-field"
          />

          <div className="filter-chips">
            <FilterIcon size={20} className="filter-icon" />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {["today", "thisWeek", "thisMonth", "lastMonth", "custom"].map(
                (period) => (
                  <Chip
                    key={period}
                    label={period.charAt(0).toUpperCase() + period.slice(1)}
                    onClick={() => setDateFilter(period)}
                    color={dateFilter === period ? "primary" : "default"}
                    variant={dateFilter === period ? "filled" : "outlined"}
                    className="filter-chip"
                  />
                )
              )}
              {(dateFilter !== "all" || searchTerm) && (
                <Tooltip title="Clear all filters">
                  <Chip
                    icon={<X size={16} />}
                    label="Clear Filters"
                    onClick={handleClearFilters}
                    color="error"
                    variant="outlined"
                    className="clear-filter-chip"
                  />
                </Tooltip>
              )}
            </Stack>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {loading ? (
          <div className="loading-state">
            <CircularProgress />
            <Typography>Loading bookings...</Typography>
          </div>
        ) : error ? (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        ) : (
          <Fade in={true}>
            <div className="table-container">
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking ID</TableCell>
                      <TableCell>Guest Name</TableCell>
                      <TableCell>Guest Email</TableCell>
                      <TableCell>Guest Phone</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Staff</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentBookings.map((booking) => (
                      <TableRow key={booking.bookingId}>
                        <TableCell>{booking.bookingId}</TableCell>
                        <TableCell>{booking.guestName}</TableCell>
                        <TableCell>{booking.guestEmail}</TableCell>
                        <TableCell>{booking.guestPhone}</TableCell>
                        <TableCell>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            style={{
                              backgroundColor: getStatusColor(booking.status),
                              color: "white",
                            }}
                          />
                        </TableCell>
                        <TableCell>{booking.note}</TableCell>
                        <TableCell>{booking.assistStaffName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="pagination-container">
                <Pagination
                  count={Math.ceil(
                    filteredAndSearchedBookings.length / bookingsPerPage
                  )}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          </Fade>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BookingManagement;
