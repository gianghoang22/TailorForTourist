import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Checkout.scss';
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";

const Checkout = () => {
  const [checkoutCart, setCheckoutCart] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('checkoutCart'));
    setCheckoutCart(cartData || []);
  }, []);

  // Tính tổng giá từ giỏ hàng
  const totalPrice = checkoutCart.reduce((total, item) => total + (item.price || 0), 0);

  const handlePayment = () => {
    // Implement payment logic here
    toast.success('Proceeding to payment!');
  };

  const [loginOpen, setLoginOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: 'Vietnam',
    city: '',
    district: '',
    streetAddress: '',
    createAccount: false,
    orderNotes: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    loginUsername: '',
    loginPassword: '',
    couponCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order logic goes here (e.g., API call to create an order)
    console.log("Order submitted", formData);
    // Optionally reset form or navigate to a confirmation page
  };

  return (
    <>
      <Navigation />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>CHECKOUT</h1>
          <h2>A DONG SILK</h2>
          <div className="underline"></div>
        </div>

        <div className="checkout-content">
          <div className="customer-actions">
            <div className="action-section">
              <button onClick={() => setLoginOpen(!loginOpen)}>
                Returning customer? Click here to login
              </button>
              <div className={`collapsible ${loginOpen ? 'open' : ''}`}>
                <form className="login-form">
                  <p>If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing section.</p>
                  <input
                    type="text"
                    name="loginUsername"
                    value={formData.loginUsername}
                    onChange={handleInputChange}
                    placeholder="Username or email *"
                    required
                  />
                  <input
                    type="password"
                    name="loginPassword"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    placeholder="Password *"
                    required
                  />
                  <button type="submit">Login</button>
                  <label>
                    <input type="checkbox" name="rememberMe" />
                    Remember me
                  </label>
                  <a href="#">Lost your password?</a>
                </form>
              </div>
            </div>

            <div className="action-section">
              <button onClick={() => setCouponOpen(!couponOpen)}>
                Have a coupon? Click here to enter your code
              </button>
              <div className={`collapsible ${couponOpen ? 'open' : ''}`}>
                <form className="coupon-form">
                  <p>If you have a coupon code, please apply it below.</p>
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="Coupon code"
                  />
                  <button type="submit">Apply Coupon</button>
                </form>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h3>BILLING DETAILS</h3>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name *"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name *"
                required
              />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone *"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address *"
              required
            />
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="Vietnam">Vietnam</option>
              {/* Add other country options */}
            </select>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Town / City *"
              required
            />
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="District *"
              required
            />
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="Street address *"
              required
            />
            <label>
              <input
                type="checkbox"
                name="createAccount"
                checked={formData.createAccount}
                onChange={handleInputChange}
              />
              Create an account?
            </label>

            <h3>ADDITIONAL INFORMATION</h3>
            <textarea
              name="orderNotes"
              value={formData.orderNotes}
              onChange={handleInputChange}
              placeholder="Notes about your order, e.g. special notes for delivery."
            />

            <h3>YOUR ORDER</h3>
            <table>
              <thead>
                <tr>
                  <th>Product (Fabric)</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {checkoutCart.length === 0 ? (
                  <tr>
                    <td colSpan="2">No items in cart</td>
                  </tr>
                ) : (
                  checkoutCart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td> {/* Hiển thị tên sản phẩm */}
                      <td>${(item.price || 0).toFixed(2)}</td> {/* Hiển thị giá sản phẩm */}
                    </tr>
                  ))
                )}
                {checkoutCart.length > 0 && (
                  <tr>
                    <td><strong>Total Price</strong></td>
                    <td><strong>${totalPrice.toFixed(2)}</strong></td> {/* Hiển thị tổng giá */}
                  </tr>
                )}
              </tbody>
            </table>

            <div className="payment-options">
              <h4>Payment Method</h4>
              <label>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="paypal" 
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                />
                <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" />
                PayPal
              </label>
              <label>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card" 
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                />
                <img src="https://purepng.com/public/uploads/large/purepng.com-visa-logologobrand-logoiconslogos-251519938794uqvcz.png" alt="Visa" width="30" />
                <img src="https://logo-marque.com/wp-content/uploads/2020/09/Mastercard-Logo.png" alt="MasterCard" width="30" />
                <img src="https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-1/128/card-512.png" alt="Credit Card" width="30" />
                Credit / Debit Card
              </label>

              {paymentMethod === 'card' && (
                <div className="card-details">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number *"
                    required
                  />
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Card Holder Name *"
                    required
                  />
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY *"
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="CVV *"
                    required
                  />
                </div>
              )}
            </div>

            <button type="submit" onClick={handlePayment}>Place Order</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
