import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Checkout.scss';
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";
import PayPalCheckoutButton from './paypalCheckout.jsx';
import ProductInfoModal from '../cart/ProductInfoModal';

const CHECKOUT_API = {
  confirmOrder: "https://localhost:7194/api/AddCart/confirmorder"
};

const Checkout = () => {
  const [checkoutCart, setCheckoutCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the cart from localStorage
    const cartData = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    const allCartData = cartData.map((item) => ({
      productType: item.type,
      productPrice: item.price || 0,
      productName: item.name || "Unknown Product",
      fabric: item.fabric,
      style: item.style,
      lining: item.lining,
    }));
    setCheckoutCart(allCartData);
  }, []);

  const total = checkoutCart.reduce((total, item) => total + item.productPrice, 0);

  const confirmOrderAPI = async () => {
    try {
      await fetch(CHECKOUT_API.confirmOrder, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestAddress,
          deposit,
          shippingFee,
          totalPrice: total,
        }),
      });
      toast.success("Order confirmed successfully.");
    } catch (error) {
      toast.error("Failed to confirm order.");
      console.error("Confirm Order Error:", error);
    }
  };

  const handlePaymentSuccess = (details) => {
    if (total <= 0) {
      toast.error("Total price must be greater than zero.");
      return;
    }
    toast.success("Payment successful!");
    console.log("Payment Details:", details);

    // Confirm the order after successful PayPal payment
    confirmOrderAPI();

    // Navigate to order confirmation page
    navigate('/checkout/order-receive');
  };

  const handlePaymentError = (error) => {
    toast.error(`Payment error: ${error.message || error}`);
    console.error("Payment Error:", error);
  };

  const handleViewInfo = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const isFormValid = guestName && guestEmail && guestAddress && deposit && shippingFee;

  return (
    <>
      <Navigation />
        <div className="page-with-side-bar">
      <div className="checkout-container">
        <div className="left-side">
          <div className="sec-title">
            <h1 className="tt-txt">
              <span className="tt-sub">Checkout</span>
              A Dong Silk
            </h1>
          </div>
        </div>

        <div className="right-main">
        <div className="checkout-content">
            <h3>BILLING DETAILS</h3>
            <div className='col-1'>
          <form className='form-row'>
            <label className='guestName'>
              Name:
              <abbr className="required" title="required">*</abbr>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}/>
            </label>
            <label className='guestEmail'>
              Email:
              <abbr className="required" title="required">*</abbr>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </label>
            <label className='guestAddress'>
              Address:
              <abbr className="required" title="required">*</abbr>
              <input
                type="text"
                value={guestAddress}
                onChange={(e) => setGuestAddress(e.target.value)}
                required
              />
            </label>
            <label className='guestDeposit'>
              Deposit:
              <abbr className="required" title="required">*</abbr>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                required
              />
            </label>
            <label className='shippingFee'>
              Shipping Fee:
              <abbr className="required" title="required">*</abbr>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                required
              />
            </label>
          </form>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {checkoutCart.length === 0 ? (
                <tr>
                  <td colSpan="4">No items in cart</td>
                </tr>
              ) : (
                checkoutCart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.productType}</td>
                    <td>${item.productPrice.toFixed(2)}</td>
                    <td>
                      <button type="button" onClick={() => handleViewInfo(item)}>
                        View Info
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {checkoutCart.length > 0 && (
                <tr>
                  <td colSpan="3">
                    <strong>Total Price</strong>
                  </td>
                  <td>
                    <strong>${total.toFixed(2)}</strong>
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
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>

            {paymentMethod === 'paypal' && (
              <PayPalCheckoutButton
                cartItems={checkoutCart}
                totalPrice={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={!isFormValid}
              />
            )}

            {paymentMethod === 'card' && (
              <div className="card-details">
                <input type="text" name="cardNumber" placeholder="Card Number" required />
                <input type="text" name="cardName" placeholder="Card Name" required />
                <input type="text" name="expiryDate" placeholder="MM/YY" required />
                <input type="text" name="cvv" placeholder="CVV" required />
              </div>
            )}

            <button type="button" onClick={handlePaymentSuccess} disabled={!isFormValid}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      </div>

      {selectedProduct && (
        <ProductInfoModal
        product={selectedProduct}
        onClose={handleCloseModal}
        />
      )}
    </div>
      <Footer />
    </>
  );
};

export default Checkout;
