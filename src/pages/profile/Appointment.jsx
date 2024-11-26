import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileNav from "./ProfileNav";
import "./Appointment.scss";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("User not authenticated");
        setIsLoading(false);
        setTimeout(
          () =>
            navigate("/signin", {
              state: { alert: "Please log in to view your appointments." },
            }),
          3000
        );
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7194/api/Booking/user-booking?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 400) {
            setAppointments([]);
          } else {
            throw new Error("Failed to fetch appointments");
          }
        } else {
          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error("Invalid response format");
          }
          setAppointments(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-page">
      <ProfileNav />
      <div className="appointment-container">
        <h2>Your Appointments</h2>
        {isLoading ? (
          <div className="appointment-loading">Loading appointments...</div>
        ) : error ? (
          <div className="appointment-error">
            <p>Error: {error}</p>
            {error === "User not authenticated" && (
              <p>Redirecting to login page...</p>
            )}
          </div>
        ) : appointments.length === 0 ? (
          <p className="no-appointments">
            You don't have any appointments yet!
          </p>
        ) : (
          <ul className="appointment-list">
            {appointments.map((appointment) => (
              <li key={appointment.bookingId} className="appointment-item">
                <div className="appointment-header">
                  <span className="appointment-date">
                    {formatDate(appointment.bookingDate)}
                  </span>
                  <span
                    className={`appointment-status ${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <p>
                    <strong>Time:</strong> {appointment.time}
                  </p>
                  <p>
                    <strong>Guest:</strong> {appointment.guestName}
                  </p>
                  <p>
                    <strong>Email:</strong> {appointment.guestEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {appointment.guestPhone}
                  </p>
                  {appointment.note && (
                    <p>
                      <strong>Note:</strong> {appointment.note}
                    </p>
                  )}
                  {appointment.service && (
                    <p>
                      <strong>Service:</strong> {appointment.service}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointment;
