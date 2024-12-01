import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";
import QuoteCarousel from "./QuoteCarousel";
import ReviewSection from "./ReviewSection";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";
import { motion } from "framer-motion";

const BookingPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    description: "",
    service: "",
  });
  const [availableStores, setAvailableStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(1);
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [serviceError, setServiceError] = useState("");

  const [selectedStoreInfo, setSelectedStoreInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    fetchStores();
    fetchUserDetails();
    updateAvailableTimes(date);
  }, [date]);

  const fetchUserDetails = async () => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      try {
        const response = await fetch(
          `https://localhost:7194/api/User/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userData = await response.json();
        if (userData) {
          setFormData({
            fullName: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            description: "",
            service: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch("https://localhost:7194/api/Store");
      const data = await response.json();
      setAvailableStores(data);
      if (data.length > 0) {
        setSelectedStoreId(data[0].storeId);
        setSelectedStoreInfo({
          name: data[0].name,
          address: `${data[0].address}`,
          phone: data[0].contactNumber,
        });
      } else {
        setSelectedStoreInfo({
          name: "",
          address: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

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
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
    ];
    setAvailableTimes(times);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStoreChange = (e) => {
    const selectedStoreId = e.target.value;
    setSelectedStoreId(selectedStoreId);

    const selectedStore = availableStores.find(
      (s) => s.storeId === parseInt(selectedStoreId)
    );
    if (selectedStore) {
      setSelectedStoreInfo({
        name: selectedStore.name,
        address: `${selectedStore.address}`,
        phone: selectedStore.contactNumber,
      });
    } else {
      setSelectedStoreInfo({
        name: "",
        address: "",
        phone: "",
      });
    }
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

    const bookingData = {
      bookingDate,
      time: `${time}:00`,
      note: formData.description,
      status: "pending",
      storeId: selectedStoreId,
      service: formData.service,
    };

    const userId = localStorage.getItem("userID");

    if (userId) {
      // For logged-in users
      bookingData.userId = userId;
      bookingData.guestName = formData.fullName;
      bookingData.guestEmail = formData.email;
      bookingData.guestPhone = formData.phone;
    } else {
      // For guests
      bookingData.guestName = formData.fullName.trim();
      bookingData.guestEmail = formData.email;
      bookingData.guestPhone = formData.phone;
    }

    // Validation checks
    let isValid = true;

    if (!bookingData.guestName) {
      setPhoneError("Please provide your name.");
      isValid = false;
    }

    if (date <= new Date()) {
      setDateError("Please select a future date.");
      isValid = false;
    } else {
      setDateError("");
    }

    if (!selectedTime) {
      setTimeError("Please select an available time.");
      isValid = false;
    } else {
      setTimeError("");
    }

    if (!userId) {
      isValid = validatePhone(formData.phone) && isValid;
    }

    if (!formData.service) {
      setServiceError("Please select a service.");
      isValid = false;
    } else {
      setServiceError("");
    }

    if (!isValid) return;

    try {
      const response = await fetch(
        "https://localhost:7194/api/Booking/guest-booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error creating booking:",
          response.statusText,
          errorData
        );
        return; // Stop execution if there's an error
      }

      const result = await response.json();
      console.log("Booking successful:", result);
      navigate("/booking-thanks");
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

  // Add these animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
      },
    },
  };

  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className="booking-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Navigation />
      <motion.div className="content-container" variants={contentVariants}>
        <motion.div
          className="left-column"
          variants={contentVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {selectedStoreInfo.name && (
            <>
              <h1>{selectedStoreInfo.name}</h1>
              <div className="location-info">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHzjFYQWUH5LXNPVt5QXsZuAaOr3niokdr-A&s"
                  alt={selectedStoreInfo.name}
                  className="location-image"
                />
                <div className="address-info">
                  <h2>{selectedStoreInfo.address}</h2>
                  <p>Hotline: {selectedStoreInfo.phone}</p>
                  <button className="bridal-appointments">
                    Click here for Bridal Appointments
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="about-section">
            <h3>About</h3>
            <p>
              "Our team at Matcha specializes in crafting premium vests tailored
              to your unique needs. Located in the heart of the city, our studio
              provides a personalized experience, blending expert craftsmanship
              with exceptional service. Visit us and explore our collection."
            </p>
          </div>
          <div className="contact-info">
            <h3>(+84) 915230240</h3>
            <p>
              Email:{" "}
              <a
                href="mailto:matchavesttailor@gmail.com
"
              >
                matchavesttailor@gmail.com
              </a>
            </p>
          </div>
          <div className="hours-section">
            <h3>Hours</h3>
            <ul>
              <li>
                <span>Monday - Sunday:</span> 10:00 am - 7:00 pm
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
        </motion.div>

        <motion.div
          className="right-column"
          variants={contentVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
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
                You have selected: <strong>{date.toLocaleDateString()}</strong>{" "}
                at <strong>{selectedTime}</strong>
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
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
            <div className="form-group">
              <label htmlFor="service">Service:</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a service</option>
                <option value="Tailor">Tailor</option>
                <option value="Return">Return</option>
                <option value="Exchange">Exchange</option>
                <option value="Fix">Fix</option>
              </select>
              {serviceError && <p className="error">{serviceError}</p>}
            </div>
            <button type="submit" className="submit-button">
              Book Appointment
            </button>
          </form>
        </motion.div>
      </motion.div>

      <motion.div variants={contentVariants} transition={{ delay: 0.6 }}>
        <QuoteCarousel />
      </motion.div>

      <motion.div variants={contentVariants} transition={{ delay: 0.7 }}>
        <ReviewSection />
      </motion.div>

      <Footer />
    </motion.div>
  );
};

export default BookingPage;
