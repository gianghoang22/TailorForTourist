import React, { useState } from "react";
import "./OrderDetails.scss";
import { FaTrash, FaShoppingCart } from "react-icons/fa"; // Ensure to install react-icons

const OrderDetails = () => {
  const [quantities, setQuantities] = useState({
    "quilt-set": 1,
    "satin-slide": 1,
  });

  const [cartItems, setCartItems] = useState([
    {
      id: "quilt-set",
      name: "NATORI COCOON QUILT TOP GREY DUVET MINI SET",
      style: "4812 3MB Multi Full/Queen",
      size: "Full/Queen",
      color: "Grey",
      price: 149.99,
      image: "/path-to-quilt-image.jpg",
      giftBox: {
        text: "NATORI GIFT BOX ($2.50 fee)",
        message: "Gift Message: Happy Birthday!",
      },
    },
    {
      id: "satin-slide",
      name: "NATORI ADORE DYNASTY SATIN SLIDE",
      style: "NT48858 Black Multi 8",
      size: "8",
      color: "Black Multi",
      price: 140.0,
      image: "/path-to-slide-image.jpg",
      giftBox: {
        text: "ADD NATORI GIFT BOX",
      },
    },
  ]);

  const handleQuantityChange = (id, increment) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + increment),
    }));
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
  };

  const handleCheckout = (item) => {
    alert(`Proceeding to checkout for ${item.name}`);
    // Implement your checkout logic here
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + item.price * quantities[item.id];
    }, 0);
  };

  return (
    <div className="order-details">
      <h1 className="order-details__title">CART</h1>

      <div className="order-details__content">
        <div className="order-details__items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="cart-item__details">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__style">Style: {item.style}</p>

                <div className="cart-item__gift-box">
                  <span className="gift-icon">🎁</span>
                  <span>{item.giftBox.text}</span>
                  {item.giftBox.message && (
                    <p className="gift-message">{item.giftBox.message}</p>
                  )}
                </div>

                <div className="cart-item__specs">
                  <div className="spec">
                    <span>Size:</span>
                    <span>{item.size}</span>
                  </div>
                  <div className="spec">
                    <span>Color:</span>
                    <span>{item.color}</span>
                  </div>
                  <div className="spec">
                    <span>Price:</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-item__quantity">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span>{quantities[item.id]}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item__total">
                  ${(item.price * quantities[item.id]).toFixed(2)}
                </div>

                <div className="cart-item__actions">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn-remove"
                    title="Remove item"
                  >
                    <FaTrash /> Remove
                  </button>
                  <button
                    onClick={() => handleCheckout(item)}
                    className="btn-checkout-item"
                    title="Checkout for this item"
                  >
                    <FaShoppingCart /> Checkout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-details__summary">
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Apply Promo Code"
              className="coupon-input"
            />
            <button className="btn-apply">Apply</button>
          </div>

          <div className="donation-section">
            <p>You Shop, We Give</p>
            <p>
              Your purchase is eligible for a $2.90 donation to support Women
              for Women International
            </p>
            <button className="btn-update">Update</button>
          </div>

          <div className="summary-calculations">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="shipping-info">Add Info</span>
            </div>
            <div className="summary-row total">
              <span>Grand total:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
          </div>

          <button className="btn-checkout">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
