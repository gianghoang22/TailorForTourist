import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";

const BASE_URL = "https://localhost:7194/api";

const fetchAllBookings = async () => {
  const response = await fetch(`${BASE_URL}/Booking`);
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return response.json();
};

const deleteBooking = async (id) => {
  const response = await fetch(`${BASE_URL}/Booking/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete booking");
  }
  return response.json();
};

const BookingList = ({ bookings }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetBookings = async () => {
      try {
        if (!bookings || bookings.length === 0) {
          const data = await fetchAllBookings();
          setBookings(data);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAndSetBookings();
  }, [bookings]);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );
    } catch (err) {
      setError(err.message);
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
      <List>
        {bookings.map((booking) => (
          <ListItem key={booking.id}>
            <ListItemText
              primary={`Booking ID: ${booking.id}`}
              secondary={`Customer: ${booking.customerName} - Date: ${new Date(booking.bookingDate).toLocaleDateString()}`}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(booking.id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BookingList;
