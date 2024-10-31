import React, { useEffect, useState } from "react";
import "./OrderHistory.scss";
import ProfileNav from "./ProfileNav";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    console.log("Retrieved userID:", userID);

    if (userID) {
      fetch(`https://localhost:7194/api/Orders/user/${userID}`)
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
    } else {
      console.log("No userID found in localStorage.");
      setError("No userID found in localStorage.");
    }
  }, []);

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
                <th>Products</th>
                <th>Date</th>
                <th>Shipped Date</th>
                <th>Total Amount</th>
                <th>Deposit</th>
                <th>Shipping Fee</th>
                <th>Balance Payment</th>
                <th>Status</th>
                <th>Note</th>
                <th>Payment ID</th>
                <th>Store ID</th>
                <th>Voucher ID</th>
                <th>Shipper Partner ID</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>
                      {order.products && order.products.length > 0 ? (
                        order.products.map((product, index) => (
                          <div key={index}>
                            <img
                              alt={product.name}
                              height="40"
                              width="40"
                              src={product.imageUrl}
                              className="product-image"
                            />
                            <div className="product-info">
                              <div>{product.name}</div>
                              <div className="product-category">
                                {product.category}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No products found</div>
                      )}
                    </td>
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
                    <td>${order.totalPrice?.toFixed(2) || "N/A"}</td>
                    <td>${order.deposit?.toFixed(2) || "N/A"}</td>
                    <td>${order.shippingFee?.toFixed(2) || "N/A"}</td>
                    <td>${order.balancePayment?.toFixed(2) || "N/A"}</td>
                    <td>
                      <span
                        className={`status ${
                          order.status ? order.status.toLowerCase() : "unknown"
                        }`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </td>
                    <td>{order.note || "No notes"}</td>
                    <td>{order.paymentId || "N/A"}</td>
                    <td>{order.storeId || "N/A"}</td>
                    <td>{order.voucherId || "N/A"}</td>
                    <td>{order.shipperPartnerId || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <a className="continue-shopping" href="#">
        Continue Shopping
      </a>
      <div className="promo-section">
        <h2>25% UP TO OFF ALL PRODUCTS</h2>
        <p>Stay Home &amp; Get Your Daily Needs From Our Shop</p>
        <p>
          Start Your Daily Shopping with{" "}
          <a href="#" className="shop-link">
            Toner
          </a>
        </p>
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe Now</button>
        <div className="promo-image">
          <img
            alt="Woman in winter clothing"
            height="300"
            src="https://storage.googleapis.com/a1aa/image/7GmYeCTIRkV6LyXeAcaJKY2e09NvqPsqHxhjz9kUn98na0LnA.jpg"
            width="300"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
