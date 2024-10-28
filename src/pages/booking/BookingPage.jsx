import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";
import QuoteCarousel from "./QuoteCarousel";
import ReviewSection from "./ReviewSection";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";

const BookingPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });
  const [availableStores, setAvailableStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(1);
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    if (date) {
      updateAvailableTimes(date);
    }
  }, [date]);

  useEffect(() => {
    fetchStores();
  }, []);

  const updateAvailableTimes = (selectedDate) => {
    const times = [
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
    ];
    setAvailableTimes(times);
  };

  const fetchStores = async () => {
    try {
      const response = await fetch("https://localhost:7194/api/Store");
      const data = await response.json();
      setAvailableStores(data);
      if (data.length > 0) {
        setSelectedStoreId(data[0].storeId);
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStoreChange = (e) => {
    const storeId = e.target.value;
    setSelectedStoreId(storeId);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(0|\+84)(\d{9,10})$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number.");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingDate = date.toISOString().split("T")[0];
    const time =
      selectedTime.includes("AM") || selectedTime.includes("PM")
        ? convertTimeTo24Hour(selectedTime)
        : selectedTime;

    // Validation checks
    let isValid = true;

    // Check future date
    if (date <= new Date()) {
      setDateError("Please select a future date.");
      isValid = false;
    } else {
      setDateError("");
    }

    // Check time selection
    if (!selectedTime) {
      setTimeError("Please select an available time.");
      isValid = false;
    } else {
      setTimeError("");
    }

    // Validate phone
    const isPhoneValid = validatePhone(formData.phone);
    if (!isPhoneValid) {
      isValid = false;
    }

    // If any validation fails, exit early
    if (!isValid) {
      return;
    }

    const bookingData = {
      bookingDate,
      time: `${time}:00`,
      note: formData.description,
      status: "on-going",
      storeId: selectedStoreId,
      guestName: `${formData.firstName} ${formData.lastName}`,
      guestEmail: formData.email,
      guestPhone: formData.phone,
    };

    try {
      const response = await fetch("https://localhost:7244/api/Bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Booking successful:", result);
        navigate("/booking-thanks");
      } else {
        console.error("Error creating booking:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  const convertTimeTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="booking-page">
      <Navigation />
      <div className="content-container">
        <div className="left-column">
          <h1>Court Street</h1>
          <div className="location-info">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHzjFYQWUH5LXNPVt5QXsZuAaOr3niokdr-A&s"
              alt="Court Street Location"
              className="location-image"
            />
            <div className="address-info">
              <h2>357 Court St,</h2>
              <h2>Brooklyn, NY 11231</h2>
              <button className="bridal-appointments">
                Click here for Bridal Appointments
              </button>
            </div>
          </div>
          <div className="about-section">
            <h3>About</h3>
            <p>
              Our team at Alts (Alteration Specialists) Court St offers standard
              services, bridal services and specialty services. The studio is
              conveniently located on Court Street between President st and
              Union st. Tour our studio.
            </p>
          </div>
          <div className="contact-info">
            <h3>(347) 223-4905</h3>
            <p>
              Email:{" "}
              <a href="mailto:courts@alterationspecialists.com">
                courts@alterationspecialists.com
              </a>
            </p>
          </div>
          <div className="hours-section">
            <h3>Hours</h3>
            <ul>
              <li>
                <span>Monday:</span> Closed
              </li>
              <li>
                <span>Tuesday - Friday:</span> 10:00 am - 7:00 pm
              </li>
              <li>
                <span>Saturday:</span> 10:00 am - 6:00 pm
              </li>
              <li>
                <span>Sunday:</span> Closed
              </li>
            </ul>
          </div>
          <div className="subway-access">
            <h3>Subway Access</h3>
            <div className="subway-icons">
              <span className="subway-icon f">F</span>
              <span className="subway-icon g">G</span>
            </div>
          </div>
          <div className="map-section">
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
        <div className="right-column">
          <h2>Book an Appointment</h2>
          <div className="studio-select">
            <select onChange={handleStoreChange} value={selectedStoreId}>
              <option value="">Change Studio</option>
              {availableStores.map((store) => (
                <option key={store.storeId} value={store.storeId}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <div className="appointment-info">
            <h3>Alts Court Street</h3>
            <p>30 minutes</p>
            <p>Click on any time to make a booking.</p>
          </div>
          <div className="custom-calendar">
            <Calendar
              onChange={setDate}
              value={date}
              minDate={new Date()} // Prevent selecting past dates
            />
          </div>
          {dateError && <p className="error">{dateError}</p>}
          <div className="available-times">
            <h4>Available Times</h4>
            {availableTimes.map((time, index) => (
              <button
                key={index}
                className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          {timeError && <p className="error">{timeError}</p>}
          {selectedTime && (
            <div className="selected-time-info">
              <p>
                You have selected: <strong>{formattedDate}</strong> at{" "}
                <strong>{selectedTime}</strong>
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="firstName">Fullname:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {phoneError && <p className="error">{phoneError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="submit-button">
              Book Appointment
            </button>
          </form>
        </div>
      </div>
      <QuoteCarousel />
      <ReviewSection />
      <Footer />
    </div>
  );
};

export default BookingPage;
