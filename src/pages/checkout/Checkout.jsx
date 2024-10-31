import React, { useState } from "react";
import "./Checkout.scss";

const Checkout = () => {
  const [shippingMethod, setShippingMethod] = useState("delivery");

  return (
    <div className="checkout">
      <div className="shipping-info">
        <h1>Checkout</h1>
        <h2>Shipping Information</h2>
        <div className="shipping-method">
          <label
            className={`method ${shippingMethod === "delivery" ? "active" : ""}`}
          >
            <input
              type="radio"
              value="delivery"
              checked={shippingMethod === "delivery"}
              onChange={() => setShippingMethod("delivery")}
            />
            <span className="icon">🚚</span> Delivery
          </label>
          <label
            className={`method ${shippingMethod === "pickup" ? "active" : ""}`}
          >
            <input
              type="radio"
              value="pickup"
              checked={shippingMethod === "pickup"}
              onChange={() => setShippingMethod("pickup")}
            />
            <span className="icon">🏬</span> Pick up
          </label>
        </div>
        <form>
          <div className="form-group">
            <label>Full name *</label>
            <input type="text" placeholder="Enter full name" required />
          </div>
          <div className="form-group">
            <label>Email address *</label>
            <input type="email" placeholder="Enter email address" required />
          </div>
          <div className="form-group">
            <label>Phone number *</label>
            <div className="phone-input">
              <select>
                <option value="+1">🇺🇸 +1</option>
                {/* Add more country codes as needed */}
              </select>
              <input type="tel" placeholder="Enter phone number" required />
            </div>
          </div>
          <div className="form-group">
            <label>Country *</label>
            <select required>
              <option value="">Choose country</option>
              <option value="vietnam">Vietnam</option>
              {/* Add more countries as needed */}
            </select>
          </div>
          <div className="form-group">
            <label>Town / City *</label>
            <input type="text" placeholder="Enter town or city" required />
          </div>
          <div className="form-group">
            <label>District *</label>
            <input type="text" placeholder="Enter district" required />
          </div>
          <div className="form-group">
            <label>Street address *</label>
            <input type="text" placeholder="Enter street address" required />
          </div>
          <label className="terms">
            <input type="checkbox" required />
            <span>I have read and agree to the Terms and Conditions.</span>
          </label>
        </form>
      </div>
      <div className="cart-review">
        <h2>Review your cart</h2>
        <div className="cart-items">
          <div className="cart-item">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="DuoComfort Sofa Premium"
            />
            <div className="item-details">
              <p className="item-name">DuoComfort Sofa Premium</p>
              <p className="item-quantity">1x</p>
            </div>
            <p className="item-price">$20.00</p>
          </div>
          <div className="cart-item">
            <img src="/placeholder.svg?height=80&width=80" alt="IronOne Desk" />
            <div className="item-details">
              <p className="item-name">IronOne Desk</p>
              <p className="item-quantity">1x</p>
            </div>
            <p className="item-price">$25.00</p>
          </div>
        </div>
        <div className="discount-code">
          <input type="text" placeholder="Discount code" />
          <button>Apply</button>
        </div>
        <div className="cart-summary">
          <div className="summary-row">
            <p>Subtotal</p>
            <p>$45.00</p>
          </div>
          <div className="summary-row">
            <p>Shipping</p>
            <p>$5.00</p>
          </div>
          <div className="summary-row">
            <p>Discount</p>
            <p className="discount">-$10.00</p>
          </div>
          <div className="summary-row total">
            <p>Total</p>
            <p>$40.00</p>
          </div>
        </div>
        <button className="pay-now">Pay Now</button>
        <div className="secure-checkout">
          <p>
            <span className="icon">🔒</span> Secure Checkout - SSL Encrypted
          </p>
          <p>
            Ensuring your financial and personal details are secure during every
            transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
