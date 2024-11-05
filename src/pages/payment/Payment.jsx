// Payment.jsx
import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import "./Payment.scss";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    if (name === "expirationDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const getCardType = (number) => {
    const firstDigit = number.charAt(0);
    const firstTwo = number.substring(0, 2);

    if (firstDigit === "4") return "visa";
    if (["51", "52", "53", "54", "55"].includes(firstTwo)) return "mastercard";
    if (["34", "37"].includes(firstTwo)) return "amex";
    return "unknown";
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <h2 className="payment-title">Payment Info</h2>

        <div className="payment-methods">
          <button
            onClick={() => {
              setPaymentMethod("card");
              setFormData((prev) => ({ ...prev, cardType: "visa" }));
            }}
            className={`method-button ${paymentMethod === "card" && formData.cardType === "visa" ? "active" : ""}`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png"
              alt="Visa"
            />
          </button>

          <button
            onClick={() => {
              setPaymentMethod("card");
              setFormData((prev) => ({ ...prev, cardType: "mastercard" }));
            }}
            className={`method-button ${paymentMethod === "card" && formData.cardType === "mastercard" ? "active" : ""}`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
            />
          </button>

          <button
            onClick={() => {
              setPaymentMethod("card");
              setFormData((prev) => ({ ...prev, cardType: "amex" }));
            }}
            className={`method-button ${paymentMethod === "card" && formData.cardType === "amex" ? "active" : ""}`}
          >
            <img
              src="https://www.acboatrentals.com/wp-content/uploads/2022/01/AMEX-845x321.png"
              alt="Amex"
            />
          </button>

          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`method-button ${paymentMethod === "paypal" ? "active" : ""}`}
          >
            <img
              src="https://static-00.iconduck.com/assets.00/paypal-icon-2048x547-tu0aql1a.png"
              alt="PayPal"
            />
          </button>
        </div>

        <form className="payment-form">
          {paymentMethod === "card" ? (
            <div className="card-details">
              <div className="form-row">
                <div className="form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Card number</label>
                <div className="card-input-wrapper">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    maxLength="19"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="card-icon" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiration date</label>
                  <input
                    type="text"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label>CVV/CVC</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength={
                      getCardType(formData.cardNumber) === "amex" ? "4" : "3"
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="paypal-details">
              <div className="form-group">
                <label>PayPal Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="billing-section">
            <h3>Billing Address</h3>

            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input type="text" name="billingFirstName" />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input type="text" name="billingLastName" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email address</label>
                <input type="email" name="billingEmail" />
              </div>
              <div className="form-group">
                <label>Phone number</label>
                <input type="tel" name="billingPhone" />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <select name="country">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" />
            </div>

            <div className="form-row three-columns">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" />
              </div>
              <div className="form-group">
                <label>State/Province</label>
                <input type="text" name="state" />
              </div>
              <div className="form-group">
                <label>Postal code</label>
                <input type="text" name="postalCode" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-continue">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
