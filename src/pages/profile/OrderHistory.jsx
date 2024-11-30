import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // npm install react-modal
import "./OrderHistory.scss";
import ProfileNav from "./ProfileNav";
import { FaStar } from 'react-icons/fa'; // npm install react-icons

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [feedbackModalIsOpen, setFeedbackModalIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    console.log("Retrieved userID:", storedUserID);

    if (storedUserID) {
      setUserID(storedUserID);

      // Fetch orders for the user
      fetch(`https://localhost:7194/api/Orders/user/${storedUserID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched orders:", data);
          setOrders(data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setError(error.message);
        });

      // Fetch payment methods for the user
      fetch(`https://localhost:7194/api/Payments/by-user/${storedUserID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched payment methods:", data);
          setPaymentMethods(data);
        })
        .catch((error) => {
          console.error("Error fetching payment methods:", error);
          setError(error.message);
        });
    } else {
      console.log("No userID found in localStorage.");
      setError("No userID found in localStorage.");
    }
  }, []);

  const fetchOrderDetails = (orderId) => {
    fetch(`https://localhost:7194/api/Orders/${orderId}/details`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Please make payment for order so that you could view details"
          );
        }
        return response.json();
      })
      .then((orderData) => {
        if (!orderData.orderDetails || !Array.isArray(orderData.orderDetails)) {
          throw new Error("Order details are not in the expected format");
        }
        return orderData.orderDetails;
      })
      .then((detailsArray) => {
        // Fetch product details for each item in the order
        const productDetailsPromises = detailsArray.map((item) =>
          fetch(`https://localhost:7194/api/Product/basic/${item.productId}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch product details");
              }
              return response.json();
            })
            .then((product) => ({
              ...item,
              productCode: product.productCode,
              price: product.price,
            }))
        );

        return Promise.all(productDetailsPromises);
      })
      .then(setOrderDetails)
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setError(error.message);
      });
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrder(orderId);
    setOrderDetails([]); // Clear previous details
    fetchOrderDetails(orderId);
    setModalIsOpen(true); // Open modal
  };

  const currentDate = new Date().toLocaleDateString('en-CA');

  const handleFeedbackSubmit = async (orderId) => {
    const feedback = {
      feedbackId: 0,
      comment: comment,
      rating: rating,
      dateSubmitted: currentDate,
      userId: parseInt(userID),
      orderId: orderId
    };

    console.log('Submitting feedback:', feedback); // Log the feedback object

    try {
      const response = await fetch('https://localhost:7194/api/Feedback/feedbackfororder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      console.log('Response status:', response.status); // Log the response status

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const responseData = await response.json();
      console.log('Response data:', responseData); // Log the response data

      setFeedbackModalIsOpen(false);
      setComment('');
      setRating(5);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      padding: "20px",
      maxWidth: "800px",
      width: "100%",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div className={`container ${isVisible ? "fade-in" : ""}`}>
      <ProfileNav />
      <h1 className="order-history-title">Order History</h1>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="order-history-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Shipped Date</th>
                <th>Status</th>
                <th>Total Price</th>
                <th>Deposit</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const paymentMethod = paymentMethods.find(
                    (method) => method.orderId === order.orderId
                  );

                  return (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {order.shippedDate
                          ? new Date(order.shippedDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`status ${
                            order.status
                              ? order.status.toLowerCase()
                              : "unknown"
                          }`}
                        >
                          {order.status || "Unknown"}
                        </span>
                      </td>
                      <td>${order.totalPrice?.toFixed(2) || "N/A"}</td>
                      <td>${order.deposit?.toFixed(2) || "N/A"}</td>
                      <td>{paymentMethod ? paymentMethod.method : "N/A"}</td>
                      <td>
                        <button
                          onClick={() => handleViewDetails(order.orderId)}
                        >
                          View Details
                        </button>
                        {order.status === 'Shipped' && (
                          <button 
                            className="received-button"
                            onClick={() => {
                              if (window.confirm('Would you like to provide feedback for this order?')) {
                                setSelectedOrder(order.orderId);
                                setFeedbackModalIsOpen(true);
                              }
                            }}
                          >
                            Received
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Order Details Modal"
      >
        <h2>Order Details for {selectedOrder}</h2>
        {orderDetails.length > 0 ? (
          <table className="order-details-table">
            <thead>
              <tr>
                <th>ProductCode/</th>
                <th>Quantity/</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail) => (
                <tr key={detail.productId}>
                  <td>{detail.productCode}</td>
                  <td>{detail.quantity}</td>
                  <td>${detail.price?.toFixed(2) || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading details...</p>
        )}
        <button onClick={() => setModalIsOpen(false)} className="close-modal">
          Close
        </button>
      </Modal>

      <Modal
        isOpen={feedbackModalIsOpen}
        onRequestClose={() => setFeedbackModalIsOpen(false)}
        style={customStyles}
        contentLabel="Feedback Modal"
      >
        <h2>Provide Feedback for Order #{selectedOrder}</h2>
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className="star"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={30}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
        <textarea
          placeholder="Please share your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
        <div className="modal-buttons">
          <button onClick={() => handleFeedbackSubmit(selectedOrder)}>Submit</button>
          <button onClick={() => setFeedbackModalIsOpen(false)}>Cancel</button>
        </div>
      </Modal>

      <a className="continue-shopping" href="#">
        Continue Shopping
      </a>
    </div>
  );
};

export default OrderHistory;
