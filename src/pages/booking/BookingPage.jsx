import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";
import QuoteCarousel from "./QuoteCarousel";
import ReviewSection from "./ReviewSection";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

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
    openTime: "",
    closeTime: "",
    imgUrl: "",
  });

  const [userOrders, setUserOrders] = useState([]);
  const [productCodes, setProductCodes] = useState([]);
  const [productNote, setProductNote] = useState("");
  const [productOrderMap, setProductOrderMap] = useState({});

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetchStores();
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (selectedStoreInfo.openTime && selectedStoreInfo.closeTime) {
      updateAvailableTimes(
        date,
        selectedStoreInfo.openTime,
        selectedStoreInfo.closeTime
      );
    }
  }, [date, selectedStoreInfo.openTime, selectedStoreInfo.closeTime]);

  useEffect(() => {
    if (["Return", "Exchange"].includes(formData.service)) {
      fetchUserOrders();
    }
  }, [formData.service]);

  const fetchUserDetails = async () => {
    const userID = localStorage.getItem("userID");
    if (userID) {
      try {
        const response = await fetch(
          `https://vesttour.xyz/api/User/${userID}`,
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
      const response = await fetch("https://vesttour.xyz/api/Store");
      const data = await response.json();

      const processedData = data.map((store) => ({
        ...store,
        imgUrl: store.imgUrl.startsWith("http")
          ? store.imgUrl
          : store.imgUrl.startsWith("/")
            ? `https://localhost:7194${store.imgUrl}`
            : `https://vesttour.xyz/api/Store/image/${store.imgUrl}`,
      }));

      console.log("Store data received:", processedData);
      processedData.forEach((store) => {
        console.log(`Store: ${store.name}, Raw Image URL: ${store.imgUrl}`);
        console.log(
          `Store: ${store.name}, Processed Image URL: ${processedData.find((s) => s.name === store.name).imgUrl}`
        );
      });

      setAvailableStores(processedData);
      if (processedData.length > 0) {
        setSelectedStoreId(processedData[0].storeId);
        setSelectedStoreInfo({
          name: processedData[0].name,
          address: `${processedData[0].address}`,
          phone: processedData[0].contactNumber,
          openTime: processedData[0].openTime,
          closeTime: processedData[0].closeTime,
          imgUrl: processedData[0].imgUrl,
        });
        console.log(
          `Selected store image URL (final): ${processedData[0].imgUrl}`
        );
        updateAvailableTimes(
          date,
          processedData[0].openTime,
          processedData[0].closeTime
        );
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const updateAvailableTimes = (selectedDate, openTime, closeTime) => {
    if (!openTime || !closeTime) return;

    const times = [];
    const [openHour, openMinute] = openTime.split(":");
    const [closeHour, closeMinute] = closeTime.split(":");

    let currentTime = new Date();
    currentTime.setHours(parseInt(openHour), parseInt(openMinute), 0);

    const endTime = new Date();
    endTime.setHours(parseInt(closeHour), parseInt(closeMinute), 0);

    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      times.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    setAvailableTimes(times);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productCode") {
      const orderId = productOrderMap[value];
      const newProductNote = `Order ID: ${orderId}, Product Code: ${value}`;
      setProductNote(newProductNote);
      setFormData((prev) => ({
        ...prev,
        description: `${newProductNote}${prev.description.replace(productNote, "")}`,
      }));
    } else if (name === "description") {
      setFormData((prev) => ({
        ...prev,
        description: productNote
          ? `${productNote} ${value.substring(value.indexOf(productNote) + productNote.length)}`
          : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleStoreChange = (e) => {
    const selectedStoreId = e.target.value;
    setSelectedStoreId(selectedStoreId);

    const selectedStore = availableStores.find(
      (s) => s.storeId === parseInt(selectedStoreId)
    );
    if (selectedStore) {
      const currentService = formData.service;
      setSelectedStoreInfo({
        name: selectedStore.name,
        address: `${selectedStore.address}`,
        phone: selectedStore.contactNumber,
        openTime: selectedStore.openTime,
        closeTime: selectedStore.closeTime,
        imgUrl: selectedStore.imgUrl,
      });
      updateAvailableTimes(
        date,
        selectedStore.openTime,
        selectedStore.closeTime
      );
      setFormData((prev) => ({
        ...prev,
        service: currentService,
      }));
    }
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
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

    // Validate service selection
    if (!formData.service) {
      setServiceError("Please select a service.");
      return;
    } else {
      setServiceError("");
    }

    // Validate product selection for specific services
    if (["Return", "Exchange"].includes(formData.service) && !productNote) {
      setServiceError("Please select a product for the chosen service.");
      return;
    } else {
      setServiceError("");
    }

    // Validate booking date is not today or earlier
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setDateError("Please select a date from tomorrow onwards.");
      return;
    } else {
      setDateError("");
    }

    const bookingDate = selectedDate.toLocaleDateString("en-CA");
    let time = selectedTime;

    // Convert time to proper format
    if (selectedTime.includes("AM") || selectedTime.includes("PM")) {
      time = convertTimeTo24Hour(selectedTime);
    }
    // Ensure time is in HH:mm:ss format
    time = time.split(":").slice(0, 2).join(":") + ":00";

    const bookingData = {
      bookingId: 0,
      userId: parseInt(localStorage.getItem("userID")),
      bookingDate,
      time,
      note: formData.description,
      status: "Pending",
      storeId: parseInt(selectedStoreId),
      guestName: formData.fullName,
      guestEmail: formData.email,
      guestPhone: formData.phone,
      service: formData.service,
      assistStaffName: "",
    };

    console.log("Sending booking data:", bookingData);

    try {
      // Determine if user is logged in
      const isLoggedIn = localStorage.getItem("token");

      // Restrict guest users to "Tailor" service only
      if (!isLoggedIn && formData.service !== "Tailor") {
        setServiceError("Guest users can only book the Tailor service.");
        return;
      }

      const endpoint = isLoggedIn
        ? "https://vesttour.xyz/api/Booking/loggedin-user-booking"
        : "https://vesttour.xyz/api/Booking/guest-booking";

      const headers = {
        "Content-Type": "application/json",
        ...(isLoggedIn && {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create booking";
        try {
          const errorData = await response.json();
          console.error("Server error details:", errorData);
          console.error("Validation errors:", errorData.errors);
          errorMessage = errorData.message || errorData.title || errorMessage;
        } catch (e) {
          console.error("Raw response:", await response.text());
          errorMessage = response.statusText || errorMessage;
        }
        console.error("Error creating booking:", errorMessage);
        return;
      }

      const result = await response.json();
      console.log("Booking successful:", result);
      navigate("/booking-thanks");
    } catch (error) {
      console.error("Error submitting booking:", error.message);
    }
  };

  const convertTimeTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    if (hours === 12) {
      hours = modifier === "PM" ? 12 : 0;
    } else if (modifier === "PM") {
      hours += 12;
    }

    // Ensure hours and minutes are two digits
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${minutes}`;
  };

  const fetchUserOrders = async () => {
    const userID = localStorage.getItem("userID");
    if (!userID) return;

    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Orders/user/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const orders = await response.json();
      const finishedOrders = orders.filter(
        (order) => order.status === "Finish"
      );

      const productMapping = {};
      const productCodesData = await Promise.all(
        finishedOrders.map(async (order) => {
          try {
            const details = await fetchOrderDetails(order.orderId);
            if (!Array.isArray(details) || details.length === 0) {
              console.log(`No details found for order ${order.orderId}`);
              return [];
            }

            const products = await Promise.all(
              details.map(async (detail) => {
                if (detail && detail.productId) {
                  const product = await fetchProductInfo(detail.productId);
                  if (product && product.productCode) {
                    productMapping[product.productCode] = order.orderId;
                  }
                  return product;
                }
                return null;
              })
            );

            return products.filter((product) => product !== null);
          } catch (error) {
            console.error(`Error processing order ${order.orderId}:`, error);
            return [];
          }
        })
      );

      const allProducts = productCodesData
        .flat()
        .filter((product) => product && product.productCode);
      const uniqueProductCodes = [
        ...new Set(allProducts.map((p) => p.productCode)),
      ];
      setProductCodes(uniqueProductCodes);
      setProductOrderMap(productMapping);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Orders/${orderId}/details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      return data.orderDetails || [];
    } catch (error) {
      console.error("Error fetching order details:", error);
      return [];
    }
  };

  const fetchProductInfo = async (productId) => {
    if (!productId) return null;

    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Product/basic/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error(`Error fetching product info for ID ${productId}:`, error);
      return null;
    }
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

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleServiceSelection = (service) => {
    if (!["Return", "Exchange"].includes(service)) {
      setProductNote("");
      setFormData((prev) => ({
        ...prev,
        service: service,
        description: prev.description.replace(productNote, "").trim(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        service: service,
      }));
    }
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
      <motion.div className="booking-hero" variants={contentVariants}>
        <h1>Book Your Perfect Fit</h1>
        <p>Experience the art of tailoring with our expert craftsmen</p>
      </motion.div>

      <motion.div className="content-container">
        <motion.div className="left-column" variants={contentVariants}>
          {selectedStoreInfo.name && (
            <div className="store-card">
              <div className="store-header">
                <h2>{selectedStoreInfo.name}</h2>
                <div className="rating">
                  <span className="stars">★★★★★</span>
                  <span className="review-count">(124 reviews)</span>
                </div>
              </div>

              <div className="location-info">
                <img
                  src={
                    selectedStoreInfo.imgUrl || "https://placehold.co/400x300"
                  }
                  alt={selectedStoreInfo.name}
                  className="location-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300";
                  }}
                />
                <div className="store-details">
                  <div className="detail-item">
                    <FaMapMarkerAlt />
                    <p>{selectedStoreInfo.address}</p>
                  </div>
                  <div className="detail-item">
                    <FaPhone />
                    <p>{selectedStoreInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>
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
                <span>Monday - Sunday:</span> {selectedStoreInfo.openTime} -{" "}
                {selectedStoreInfo.closeTime}
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

        <motion.div className="right-column" variants={contentVariants}>
          <div className="booking-wizard">
            <motion.div
              className="booking-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Booking Summary</h3>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="label">Studio:</span>
                  <span className="value">
                    {selectedStoreInfo.name || "Not selected"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Date:</span>
                  <span className="value">
                    {date ? formatDate(date) : "Not selected"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Time:</span>
                  <span className="value">
                    {selectedTime || "Not selected"}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="booking-form-container">
              <div className="form-section service-selection">
                {serviceError && <p className="error">{serviceError}</p>}
                <select
                  className="studio-select elegant-select"
                  onChange={handleStoreChange}
                  value={selectedStoreId}
                >
                  <option value="">Select Studio Location</option>
                  {availableStores.map((store) => (
                    <option key={store.storeId} value={store.storeId}>
                      {store.name}
                    </option>
                  ))}
                </select>

                <div className="service-grid">
                  {(localStorage.getItem("token")
                    ? ["Tailor", "Return", "Exchange"]
                    : ["Tailor"]
                  ).map((service) => (
                    <motion.div
                      key={service}
                      className={`service-card ${formData.service === service ? "selected" : ""}`}
                      onClick={() => handleServiceSelection(service)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <h3>{service}</h3>
                      <p className="duration">
                        <FaClock /> 30 minutes
                      </p>
                    </motion.div>
                  ))}
                </div>

                {["Return", "Exchange"].includes(formData.service) && (
                  <div className="form-section">
                    <label htmlFor="productCode">Select Product:</label>
                    <select
                      id="productCode"
                      name="productCode"
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a product</option>
                      {productCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <motion.div
                className="form-section datetime-selection"
                variants={stepVariants}
              >
                <div className="calendar-container">
                  <Calendar
                    onChange={setDate}
                    value={date}
                    minDate={tomorrow}
                    className="modern-calendar"
                    formatDay={(locale, date) => date.getDate()}
                  />
                </div>

                <div className="time-slots-container">
                  <h4>Available Times</h4>
                  <div className="time-grid">
                    {availableTimes.map((time, index) => (
                      <motion.button
                        key={index}
                        className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                        onClick={() => handleTimeSelection(time)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={
                    ["Return", "Exchange"].includes(formData.service)
                      ? "Please provide additional details about your request..."
                      : "Tell us about your requirements..."
                  }
                />
              </div>

              <AnimatePresence mode="wait">
                {selectedTime && (
                  <motion.form
                    className="form-section personal-details"
                    onSubmit={handleSubmit}
                    variants={stepVariants}
                  >
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
                    <button type="submit" className="submit-button">
                      Book Appointment
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
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
