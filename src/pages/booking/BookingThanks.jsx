import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./BookingThanks.scss";

const BookingThanks = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <h1>Thank You!</h1>
        <p>Your appointment has been successfully booked.</p>
        <p>We look forward to seeing you!</p>
        <button className="btn-home" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingThanks;
