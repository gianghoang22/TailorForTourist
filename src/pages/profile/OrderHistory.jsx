import React, { useEffect, useState } from "react";
import "./OrderHistory.scss";
import ProfileNav from "./ProfileNav";

const OrderHistory = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay to allow for the fade-in effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`container ${isVisible ? "fade-in" : ""}`}>
      <ProfileNav /> {/* Include ProfileNav at the top */}
      <h1 className="order-history-title">Order History</h1>
      <div className="order-history-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TBT15454841</td>
              <td>
                <img
                  alt="World's Most Expensive T Shirt"
                  height="40"
                  width="40"
                  src="https://storage.googleapis.com/a1aa/image/5vgxvCs9zboXJVKBQxKAQce9fiPzj6WkfkYdKJR8iXaha0LnA.jpg"
                  className="product-image"
                />
                <div className="product-info">
                  <div>World's Most Expensive T Shirt</div>
                  <div className="product-category">Women's Clothes</div>
                </div>
              </td>
              <td>01 Jul, 2022</td>
              <td>$287.53</td>
              <td>
                <span className="status delivered">Delivered</span>
              </td>
            </tr>
            <tr>
              <td>TBT15425012</td>
              <td>
                <img
                  alt="Onyx SmartGRID Chair Red"
                  height="40"
                  width="40"
                  src="https://storage.googleapis.com/a1aa/image/KYLmBfJfizoHOE8iJBhpvUkvVgahNgh1yjmkBY6mW03VN6lTA.jpg"
                  className="product-image"
                />
                <div className="product-info">
                  <div>Onyx SmartGRID Chair Red</div>
                  <div className="product-category">Furniture &amp; Decor</div>
                </div>
              </td>
              <td>01 Feb, 2023</td>
              <td>$39.99</td>
              <td>
                <span className="status shipping">Shipping</span>
              </td>
            </tr>
            <tr>
              <td>TBT1524563</td>
              <td>
                <img
                  alt="Slippers Open Toe"
                  height="40"
                  width="40"
                  src="https://storage.googleapis.com/a1aa/image/xQro2xJEeSWVF6MJ31lhRELmdqI5DahHZNPb1CYpRoFrG9yJA.jpg"
                  className="product-image"
                />
                <div className="product-info">
                  <div>Slippers Open Toe</div>
                  <div className="product-category">Footwear</div>
                </div>
              </td>
              <td>09 Dec, 2022</td>
              <td>$874.00</td>
              <td>
                <span className="status out-of-delivery">Out of Delivery</span>
              </td>
            </tr>
            <tr>
              <td>TBT1524530</td>
              <td>
                <img
                  alt="Hp Trendsetter Backpack"
                  height="40"
                  width="40"
                  src="https://storage.googleapis.com/a1aa/image/f5anmhpEtmQvZqX0Im5HyIjBM7WzhnER6D6TWITuhyPpG9yJA.jpg"
                  className="product-image"
                />
                <div className="product-info">
                  <div>Hp Trendsetter Backpack</div>
                  <div className="product-category">
                    Handbags &amp; Clutches
                  </div>
                </div>
              </td>
              <td>02 Jan, 2023</td>
              <td>$32.00</td>
              <td>
                <span className="status delivered">Delivered</span>
              </td>
            </tr>
            <tr>
              <td>TBT13642870</td>
              <td>
                <img
                  alt="Innovative education book"
                  height="40"
                  width="40"
                  src="https://storage.googleapis.com/a1aa/image/BuDt4sY9QWbIIVnedo9TBnA4DGdlMGgZRV7Mff5dsXQua0LnA.jpg"
                  className="product-image"
                />
                <div className="product-info">
                  <div>Innovative education book</div>
                  <div className="product-category">Books</div>
                </div>
              </td>
              <td>08 Jan, 2023</td>
              <td>$18.32</td>
              <td>
                <span className="status pending">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
