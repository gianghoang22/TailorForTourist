import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { BookingChart } from "./DashboardCharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Grid, Stack, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const BASE_URL = "https://vesttour.xyz/api";

const fetchStoreByStaffId = async (staffId) => {
  const response = await fetch(`${BASE_URL}/Store/GetStoreByStaff/${staffId}`);
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

const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(`${BASE_URL}/Booking/status/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });
    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }
    return response.json();
  } catch (error) {
    throw new Error(`Error updating status: ${error.message}`);
  }
};

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 7;
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    if (event.target.value !== "custom") {
      setCustomDateRange({ startDate: null, endDate: null });
    }
  };

  const filterBookings = (bookings) => {
    const now = new Date();
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);

      let dateMatch = true;
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
          dateMatch =
            bookingDate.getMonth() === now.getMonth() &&
            bookingDate.getFullYear() === now.getFullYear();
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          dateMatch =
            bookingDate.getMonth() === lastMonth.getMonth() &&
            bookingDate.getFullYear() === lastMonth.getFullYear();
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userID");
        console.log("Retrieved userId from localStorage:", userId);

        if (!userId) {
          console.warn("User ID not found");
          setLoading(false);
          return;
        }

        try {
          const storeData = await fetchStoreByStaffId(userId);
          const bookingsData = await fetchBookingsByStoreId(storeData.storeId);
          setBookings(Array.isArray(bookingsData) ? bookingsData : [bookingsData]);
        } catch (err) {
          console.error("API Error:", err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingBookingId(bookingId);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      await updateBookingStatus(bookingId, newStatus);
    } catch (err) {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: booking.status }
            : booking
        )
      );
      setError(err.message);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#ffa726"; // Orange
      case "confirmed":
        return "#66bb6a"; // Green
      case "cancel":
        return "#ef5350"; // Red
      default:
        return "#9e9e9e"; // Grey
    }
  };

  // Add function to process booking data for chart
  const processBookingData = (bookings) => {
    const bookingCountByDate = bookings.reduce((acc, booking) => {
      const date = booking.bookingDate.split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {});
    return Object.values(bookingCountByDate);
  };

  const sortedBookings = [...bookings].sort(
    (a, b) => b.bookingId - a.bookingId
  );
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Add helper function to check if status is immutable
  const isStatusImmutable = (status) => {
    return ["Confirmed", "Cancel"].includes(status);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Booking Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Booking Management
      </Typography>

      {/* Stats Summary Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              Total Bookings
            </Typography>
            <Typography variant="h4">
              {filterBookings(bookings).length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="success.main">
              Confirmed
            </Typography>
            <Typography variant="h4">
              {
                filterBookings(bookings).filter(
                  (b) => b.status.toLowerCase() === "confirmed"
                ).length
              }
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="warning.main">
              Pending
            </Typography>
            <Typography variant="h4">
              {
                filterBookings(bookings).filter(
                  (b) => b.status.toLowerCase() === "pending"
                ).length
              }
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="error.main">
              Cancelled
            </Typography>
            <Typography variant="h4">
              {
                filterBookings(bookings).filter(
                  (b) => b.status.toLowerCase() === "cancel"
                ).length
              }
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Enhanced Filter Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f8f9fa" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            Filter Bookings
          </Typography>
          <Button
            startIcon={<ClearIcon />}
            onClick={() => {
              setDateFilter("all");
              setCustomDateRange({ startDate: null, endDate: null });
            }}
          >
            Clear Filters
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {["today", "thisWeek", "thisMonth", "lastMonth"].map((period) => (
              <Chip
                key={period}
                label={
                  period.charAt(0).toUpperCase() +
                  period.slice(1).replace(/([A-Z])/g, " $1")
                }
                onClick={() => setDateFilter(period)}
                color={dateFilter === period ? "primary" : "default"}
                variant={dateFilter === period ? "filled" : "outlined"}
                sx={{ textTransform: "capitalize" }}
              />
            ))}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Custom Date Range
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={customDateRange.startDate}
                    onChange={(newValue) => {
                      setDateFilter("custom");
                      setCustomDateRange((prev) => ({
                        ...prev,
                        startDate: newValue,
                      }));
                    }}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={customDateRange.endDate}
                    onChange={(newValue) => {
                      setDateFilter("custom");
                      setCustomDateRange((prev) => ({
                        ...prev,
                        endDate: newValue,
                      }));
                    }}
                    minDate={customDateRange.startDate}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Chart Section */}

      <TableContainer component={Paper}>
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
              {/* <TableCell>Staff</TableCell> */}
              <TableCell>Change Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterBookings(currentBookings).map((booking) => (
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
                {/* <TableCell>{booking.assistStaffName}</TableCell> */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Select
                      size="small"
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.bookingId, e.target.value)
                      }
                      sx={{ minWidth: 120 }}
                      disabled={
                        updatingBookingId === booking.bookingId ||
                        isStatusImmutable(booking.status)
                      }
                    >
                      <MenuItem value="Pending">
                        Pending{" "}
                        {updatingBookingId === booking.bookingId && "..."}
                      </MenuItem>
                      <MenuItem value="Confirmed">
                        Confirmed{" "}
                        {updatingBookingId === booking.bookingId && "..."}
                      </MenuItem>
                      <MenuItem value="Cancel">
                        Cancel{" "}
                        {updatingBookingId === booking.bookingId && "..."}
                      </MenuItem>
                    </Select>
                    {updatingBookingId === booking.bookingId && (
                      <CircularProgress size={20} />
                    )}
                    {isStatusImmutable(booking.status) && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      ></Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {Array.from(
          { length: Math.ceil(sortedBookings.length / bookingsPerPage) },
          (_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              variant={currentPage === index + 1 ? "contained" : "outlined"}
              sx={{ mx: 0.5 }}
            >
              {index + 1}
            </Button>
          )
        )}
      </Box>
    </div>
  );
};

export default BookingList;
