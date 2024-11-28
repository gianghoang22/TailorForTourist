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
} from "@mui/material";

const BASE_URL = "https://localhost:7194/api";

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
};

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userID");
        console.log("Retrieved userId from localStorage:", userId);

        if (!userId) {
          throw new Error("User ID not found");
        }
        const storeData = await fetchStoreByStaffId(userId);
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (err) {
      setError(err.message);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
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
              <TableCell>Change Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
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
                <TableCell>
                  <Select
                    size="small"
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking.bookingId, e.target.value)
                    }
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Cancel">Cancel</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookingList;
