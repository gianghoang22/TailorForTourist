import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Checkout.scss";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";

const Checkout = () => {
  const [checkoutCart, setCheckoutCart] = useState([]);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("checkoutCart")) || [];

    // Assuming each item now has a productName property along with productId, type, and price
    const allCartData = cartData.map((item) => ({
      productId: item.productId,
      productName: item.productName, // Include productName here
      productType: item.type,
      productPrice: item.price || 0,
    }));

    setCheckoutCart(allCartData);
  }, []);

  const totalPrice = checkoutCart.reduce(
    (total, item) => total + item.productPrice,
    0
  );

  const handlePayment = () => {
    toast.success("Proceeding to payment!");
  };

  const [loginOpen, setLoginOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "Vietnam",
    city: "",
    district: "",
    streetAddress: "",
    createAccount: false,
    orderNotes: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    loginUsername: "",
    loginPassword: "",
    couponCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted", formData);
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
              <div className={`collapsible ${loginOpen ? "open" : ""}`}>
                <form className="login-form">
                  <p>
                    If you have shopped with us before, please enter your
                    details below. If you are a new customer, please proceed to
                    the Billing section.
                  </p>
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
              <div className={`collapsible ${couponOpen ? "open" : ""}`}>
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
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {checkoutCart.length === 0 ? (
                  <tr>
                    <td colSpan="3">No items in cart</td>
                  </tr>
                ) : (
                  checkoutCart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td> {/* Display Product Name */}
                      <td>{item.productType}</td> {/* Display Product Type */}
                      <td>${item.productPrice.toFixed(2)}</td>{" "}
                      {/* Display Product Price */}
                    </tr>
                  ))
                )}
                {checkoutCart.length > 0 && (
                  <tr>
                    <td colSpan="2">
                      <strong>Total Price</strong>
                    </td>
                    <td>
                      <strong>${totalPrice.toFixed(2)}</strong>
                    </td>
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
                  checked={paymentMethod === "paypal"}
                  onChange={handlePaymentMethodChange}
                />
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                  alt="PayPal"
                />
                PayPal
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={handlePaymentMethodChange}
                />
                <img
                  src="https://purepng.com/public/uploads/large/purepng.com-visa-logologobrand-logoiconslogos-251519938794uqvcz.png"
                  alt="Visa"
                  width="30"
                />
                <img
                  src="https://logo-marque.com/wp-content/uploads/2020/09/Mastercard-Logo.png"
                  alt="MasterCard"
                  width="30"
                />
                Credit Card
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="payment-details">
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
                  placeholder="Name on Card *"
                  required
                />
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="Expiry Date (MM/YY) *"
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

            <button type="button" onClick={handlePayment}>
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
// import React, { useState } from "react";
// import "./Checkout.scss";

// const Checkout = () => {
//   const [shippingMethod, setShippingMethod] = useState("delivery");

//   return (
//     <div className="checkout">
//       <div className="shipping-info">
//         <h1>Checkout</h1>
//         <h2>Shipping Information</h2>
//         <div className="shipping-method">
//           <label
//             className={`method ${shippingMethod === "delivery" ? "active" : ""}`}
//           >
//             <input
//               type="radio"
//               value="delivery"
//               checked={shippingMethod === "delivery"}
//               onChange={() => setShippingMethod("delivery")}
//             />
//             <span className="icon">🚚</span> Delivery
//           </label>
//           <label
//             className={`method ${shippingMethod === "pickup" ? "active" : ""}`}
//           >
//             <input
//               type="radio"
//               value="pickup"
//               checked={shippingMethod === "pickup"}
//               onChange={() => setShippingMethod("pickup")}
//             />
//             <span className="icon">🏬</span> Pick up
//           </label>
//         </div>
//         <form>
//           <div className="form-group">
//             <label>Full name *</label>
//             <input type="text" placeholder="Enter full name" required />
//           </div>
//           <div className="form-group">
//             <label>Email address *</label>
//             <input type="email" placeholder="Enter email address" required />
//           </div>
//           <div className="form-group">
//             <label>Phone number *</label>
//             <div className="phone-input">
//               <select>
//                 <option value="+1">🇺🇸 +1</option>
//                 {/* Add more country codes as needed */}
//               </select>
//               <input type="tel" placeholder="Enter phone number" required />
//             </div>
//           </div>
//           <div className="form-group">
//             <label>Country *</label>
//             <select required>
//               <option value="">Choose country</option>
//               <option value="vietnam">Vietnam</option>
//               {/* Add more countries as needed */}
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Town / City *</label>
//             <input type="text" placeholder="Enter town or city" required />
//           </div>
//           <div className="form-group">
//             <label>District *</label>
//             <input type="text" placeholder="Enter district" required />
//           </div>
//           <div className="form-group">
//             <label>Street address *</label>
//             <input type="text" placeholder="Enter street address" required />
//           </div>
//           <label className="terms">
//             <input type="checkbox" required />
//             <span>I have read and agree to the Terms and Conditions.</span>
//           </label>
//         </form>
//       </div>
//       <div className="cart-review">
//         <h2>Review your cart</h2>
//         <div className="cart-items">
//           <div className="cart-item">
//             <img
//               src="/placeholder.svg?height=80&width=80"
//               alt="DuoComfort Sofa Premium"
//             />
//             <div className="item-details">
//               <p className="item-name">DuoComfort Sofa Premium</p>
//               <p className="item-quantity">1x</p>
//             </div>
//             <p className="item-price">$20.00</p>
//           </div>
//           <div className="cart-item">
//             <img src="/placeholder.svg?height=80&width=80" alt="IronOne Desk" />
//             <div className="item-details">
//               <p className="item-name">IronOne Desk</p>
//               <p className="item-quantity">1x</p>
//             </div>
//             <p className="item-price">$25.00</p>
//           </div>
//         </div>
//         <div className="discount-code">
//           <input type="text" placeholder="Discount code" />
//           <button>Apply</button>
//         </div>
//         <div className="cart-summary">
//           <div className="summary-row">
//             <p>Subtotal</p>
//             <p>$45.00</p>
//           </div>
//           <div className="summary-row">
//             <p>Shipping</p>
//             <p>$5.00</p>
//           </div>
//           <div className="summary-row">
//             <p>Discount</p>
//             <p className="discount">-$10.00</p>
//           </div>
//           <div className="summary-row total">
//             <p>Total</p>
//             <p>$40.00</p>
//           </div>
//         </div>
//         <button className="pay-now">Pay Now</button>
//         <div className="secure-checkout">
//           <p>
//             <span className="icon">🔒</span> Secure Checkout - SSL Encrypted
//           </p>
//           <p>
//             Ensuring your financial and personal details are secure during every
//             transaction.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
