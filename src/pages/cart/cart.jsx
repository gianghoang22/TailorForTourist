import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { getCart, removeFromCart, updateQuantity } from '../../utils/cartUtil.js';
import './Cart.scss';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const items = getCart();
    console.log("Lấy giỏ hàng khi render:", items);
    setCartItems(items);
    calculateTotal(items);
  }, []);

  // Recalculate the total price whenever cartItems change
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
      // Only include fabric items in total price calculation
      if (item.type === 'fabric') {
        return acc + item.price * item.quantity;
      }
      return acc; // Don't add styles or linings
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (id, type) => {
    const updatedCart = removeFromCart(id, type);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleQuantityChange = (id, type, delta) => {
    const updatedCart = updateQuantity(id, type, delta);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleReturnToCustomization = () => {
    navigate('/custom-suits/'); // Navigate to the customization page
  };

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-details">
                  <h2>{item.name}</h2>
                  <h3>{item.price} USD</h3>
                  <img src={item.imageUrl} alt={item.name} />
                  <p>Type: {item.type}</p>

                  {/* Quantity controls */}
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, item.type, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.type, item.quantity + 1)}>+</button>
                  </div>
                  
                  {/* Remove button */}
                  <button onClick={() => handleRemoveFromCart(item.id, item.type)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Display total price */}
          <div className="total-price">
            <h2>Total Price: {totalPrice} USD</h2>
          </div>

          {/* Return to customization button */}
          <button className="return-button" onClick={handleReturnToCustomization}>
            Return to Customization
          </button>

          {/* Checkout button */}
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
