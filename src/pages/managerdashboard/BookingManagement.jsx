import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert, Pagination, Chip, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./BookingManagement.scss";

const BASE_URL = "https://localhost:7194/api";

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
                if (!userId) {
                    throw new Error("User ID not found");
                }
                const storeData = await fetchStoreByManagerId(userId);
                const bookingsData = await fetchBookingsByStoreId(storeData.storeId);
                setBookings(
                    Array.isArray(bookingsData) ? bookingsData : [bookingsData]
                );
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Sort bookings by bookingId descending
    const sortedBookings = [...bookings].sort((a, b) => b.bookingId - a.bookingId);
    const filteredBookings = filterBookings(sortedBookings);

    // Calculate the current bookings to display
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
    };

    return (
        <div className="booking-management">
            <div className="header">
                <Typography variant="h4">Booking Management</Typography>
                <Link to="/manager" className="back-link">Back to Dashboard</Link>
            </div>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Box>
                    {/* Filter Section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Filter Bookings</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {["today", "thisWeek", "thisMonth", "lastMonth"].map((period) => (
                                <Chip
                                    key={period}
                                    label={period.charAt(0).toUpperCase() + period.slice(1)}
                                    onClick={() => setDateFilter(period)}
                                    color={dateFilter === period ? "primary" : "default"}
                                    variant={dateFilter === period ? "filled" : "outlined"}
                                />
                            ))}
                            <Chip
                                label="Custom Range"
                                onClick={() => setDateFilter("custom")}
                                color={dateFilter === "custom" ? "primary" : "default"}
                                variant={dateFilter === "custom" ? "filled" : "outlined"}
                            />
                        </Stack>
                    </Box>

                    {/* Custom Date Range Picker */}
                    {dateFilter === "custom" && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={2} sx={{ mb: 2 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={customDateRange.startDate}
                                    onChange={(newValue) => {
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
                    )}

                    {/* Booking Table */}
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
                                        <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
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

                    {/* Pagination Component */}
                    <Pagination
                        count={Math.ceil(filteredBookings.length / bookingsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </div>
    );
};

export default BookingManagement;