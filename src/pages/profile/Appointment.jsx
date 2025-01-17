import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileNav from "./ProfileNav";
import "./Appointment.scss";
import { FaSpinner } from "react-icons/fa";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
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
          `https://vesttour.xyz/api/Booking/user-booking?userId=${userId}`,
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
          const sortedAppointments = data.sort(
            (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
          );
          setAppointments(sortedAppointments);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-page">
      <ProfileNav />
      <div className="content-container">
        <h2>Your Appointments</h2>
        {isLoading ? (
          <div className="appointment-loading">
            <FaSpinner className="spinner" />
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="appointment-error">
            <p>Error: {error}</p>
            {error === "User not authenticated" && (
              <p>Redirecting to login page...</p>
            )}
          </div>
        ) : appointments.length === 0 ? (
          <div className="no-appointments">
            <p>You don't have any appointments yet!</p>
            <button
              onClick={() => navigate("/booking")}
              className="book-now-btn"
            >
              Book Now
            </button>
          </div>
        ) : (
          <>
            <ul className="appointment-list">
              {currentAppointments.map((appointment) => (
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

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Appointment;
