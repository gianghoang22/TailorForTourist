import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Checkout.scss';
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";
import PayPalCheckoutButton from './paypalCheckout.jsx';
import ProductInfoModal from '../cart/ProductInfoModal';
import axios from 'axios';

const CHECKOUT_API = {
  confirmOrder: "https://localhost:7194/api/AddCart/confirmorder"
};

const Checkout = () => {
  const [checkoutCart, setCheckoutCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [guestFname, setGuestFname] = useState('');
  const [guestLname, setGuestLname] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const navigate = useNavigate();
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);


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
          guestFname,
          guestLname,
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

    confirmOrderAPI();

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

  //API ti gia USD VND
  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const rate = response.data.rates.VND;
      setExchangeRate(rate);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setLoading(false);
    }
  };

  fetchExchangeRate();

  
  if (loading) return <span>Loading exchange rate...</span>;

  const convertToVND = (USD) => USD * exchangeRate;

  const isFormValid = guestFname && guestLname && guestEmail && guestAddress && deposit && shippingFee;

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
          <div className="woocommerce">
        <div className="col2-set" id='customer_details'>
            <div className='col1-set'>
          <div className="woocommerce-billing-fields">
            <h3>Billing details</h3>
            <div className="woocommerce-billing-fields__filed-wrapper">
            
            <p className="form-row form-row-first validate-required" id="billing_first_name_field" data-priority="1">
  <label htmlFor="billing_first_name" className="">
    First name&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="text"
      className="input-text"
      name="billing_first_name"
      id="billing_first_name"
      placeholder=""
      value={guestFname}
      autoComplete="given-name"
      onChange={(e) => setGuestFname(e.target.value)}
      required
    />
  </span>
</p>

<p
  className="form-row form-row-last validate-required"
  id="billing_last_name_field"
  data-priority="2"
>
  <label htmlFor="billing_last_name" className="">
    Last name&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="text"
      className="input-text"
      name="billing_last_name"
      id="billing_last_name"
      placeholder=""
      value={guestLname}
      onChange={(e) => setGuestLname(e.target.value)}
      autoComplete="family-name"
    />
  </span>
</p>


<p
  className="form-row form-row-wide validate-required validate-phone"
  id="billing_phone_field"
  data-priority="3"
>
  <label htmlFor="billing_phone" className="">
    Phone&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="tel"
      className="input-text"
      name="billing_phone"
      id="billing_phone"
      placeholder=""
      value={guestPhone}
      onChange={(e) => setGuestPhone(e.target.value)}
      autoComplete="tel"
    />
  </span>
</p>

<p
  className="form-row form-row-wide validate-required validate-email"
  id="billing_email_field"
  data-priority="4"
>
  <label htmlFor="billing_email" className="">
    Email address&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="email"
      className="input-text"
      name="billing_email"
      id="billing_email"
      placeholder=""
      value={guestEmail}
      onChange={(e) => setGuestEmail(e.target.value)}
      autoComplete="email username"
    />
  </span>
</p>

<p
  className="form-row form-row-wide validate-required"
  id="guest_address_field"
  data-priority="5"
>
  <label htmlFor="guest_address" className="guestAddress">
    Address&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="text"
      id="guest_address"
      name="guest_address"
      value={guestAddress}
      onChange={(e) => setGuestAddress(e.target.value)}
      required
    />
  </span>
</p>

<p
  className="form-row form-row-wide validate-required"
  id="guest_deposit_field"
  data-priority="6"
>
  <label htmlFor="guest_deposit" className="guestDeposit">
    Deposit&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="number"
      id="guest_deposit"
      name="guest_deposit"
      value={deposit}
      onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
      required
    />
  </span>
</p>

<p
  className="form-row form-row-wide validate-required"
  id="shipping_fee_field"
  data-priority="7"
>
  <label htmlFor="shipping_fee" className="shippingFee">
    Shipping Fee&nbsp;<abbr className="required" title="required">*</abbr>
  </label>
  <span className="woocommerce-input-wrapper">
    <input
      type="number"
      id="shipping_fee"
      name="shipping_fee"
      value={shippingFee}
      onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
      required
    />
  </span>
</p>

            </div>
          </div>
         
          </div>
                </div>
          
          <h3 id="order_review_heading">Your order</h3>
          <div id="order_review" className="woocommerce-checkout-review-order">

          <table className='shop_table woocommerce-checkout-review-order-table'>
    <thead>
      <tr>
        <th className='product-name'>Product</th>
        <th className='product-total'>Total</th>
        <th className='product-info'></th>
      </tr>
    </thead>
    <tbody>
      {checkoutCart.length === 0 ? (
        <tr>
          <td colSpan="4">No items in cart</td>
        </tr>
      ) : (
        checkoutCart.map((item, index) => (
          <tr className='cart_item' key={index}>
            <td className='product-name'>{item.productName}</td>
            <td className='product-total'>
              <span className="woocommerce-Price-amount amount">
                {item.productPrice.toFixed(2)}&nbsp;
              </span>
              <span className="woocommerce-Price-currencySymbol">USD</span>
            </td>
            <td className='product-info'>
              <button className='btn mona-view-product-info' type="button" onClick={() => handleViewInfo(item)}>
                View Info
              </button>
            </td>
          </tr>
        ))
      )}
      
      {/* Shipping row outside the loop, inside tbody */}
      <tr>
        <td className='product-name'>
          <strong>Shipping</strong>
        </td>
        <td className="product-total" colSpan={2}>
          <p>
            Shipping cost is based on the weight of the order. Our Online Department will inform you the cost before we ship.
          </p>
          <p>
            Read more: <strong>
              <a href="#" style={{color: '#a4712a'}}>Shipping policy</a>
            </strong>
          </p>
        </td>
      </tr>
    </tbody>
    <tfoot>
      {checkoutCart.length > 0 && (
        <>
          <tr className='cart-subtotal'>
            <th>Subtotal</th>
            <td colSpan="2">
              <span className='woocommerce-Price-amount amount'>{total.toFixed(2)}&nbsp;
                <span className='woocommerce-Price-currencySymbol'>USD</span>
              </span>
            </td>
          </tr>
          <tr className="order-total">
            <th>Total</th>
            <td colSpan="2">
              <strong>
                <span className='woocommerce-Price-amount amount'>{total.toFixed(2)}&nbsp;
                  <span className='woocommerce-Price-currencySymbol'>USD&nbsp; ({convertToVND(total).toLocaleString("vi-VN")} VND)</span>
                </span>
              </strong>
            </td>
          </tr>
        </>
      )}
    </tfoot>
  </table>

          <div id="order" className="woocommerce-checkout-payment">
  <ul className="wc_payment_methods payment_methods methods">
    {/* PayPal Option */}
    <li className="wc_payment_method payment_method_paypal">
      <input
        id="payment_method_paypal"
        type="radio"
        className="input-radio"
        name="payment_method"
        value="paypal"
        checked={paymentMethod === "paypal"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      <label htmlFor="payment_method_paypal">PayPal</label>
      {paymentMethod === "paypal" && (
        <div className="payment_box payment_method_paypal" style={{ display: "block" }}>
          <PayPalCheckoutButton
            cartItems={checkoutCart}
            totalPrice={total}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            disabled={!isFormValid}
          />
        </div>
      )}
    </li>

    {/* Credit Card Option */}
    <li className="wc_payment_method payment_method_credit_card">
      <input
        id="payment_method_credit_card"
        type="radio"
        className="input-radio"
        name="payment_method"
        value="card"
        checked={paymentMethod === "card"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      <label htmlFor="payment_method_credit_card">Credit Card</label>
      {paymentMethod === "card" && (
        <div className="payment_box payment_method_credit_card" style={{ display: "block" }}>
          <div className="card-details">
            <input type="text" name="cardNumber" placeholder="Card Number" required />
            <input type="text" name="cardName" placeholder="Card Name" required />
            <input type="text" name="expiryDate" placeholder="MM/YY" required />
            <input type="text" name="cvv" placeholder="CVV" required />
          </div>
        </div>
      )}
    </li>
  </ul>

  <div className="form-row place-order">
    <button
      type="button"
      className="button alt"
      name="woocommerce_checkout_place_order"
      id="place_order"
      value="Place order"
      data-value="Place order"
      onClick={handlePaymentSuccess}
      disabled={!isFormValid}
    >
      Proceed to Payment
    </button>
  </div>
</div>

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
