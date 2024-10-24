import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { getCart, removeFromCart, updateQuantity } from '../../utils/cartUtil.js';
import './Cart.scss';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
      if (item.type === 'fabric') {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (uniqueId) => {
    const updatedCart = removeFromCart(uniqueId);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };
  const handleQuantityChange = (id, type, delta) => {
    const updatedCart = updateQuantity(id, type, delta);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleReturnToCustomization = () => {
    navigate('/custom-suits/');
  };

  const handleCheckout = () => {
    const currentCart = getCart();
    localStorage.setItem('checkoutCart', JSON.stringify(currentCart)); // Save cart data to localStorage
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <>
    <Navigation/>
      <div className="page-with-side-bar">
        <div className="all">
          <div className="left-side">
            <div className="sec-title">
              <h1 className="tt-txt">
                <span className="tt-sub">Cart</span>
                A Dong Silk
              </h1>
            </div>
          </div>
          <div className="right-main">
            <div className="woocommerce">
              <form className="woocommerce-cart-form">
                <table className="shop_table" cellSpacing={0}>
                  <thead>
                    <tr>
                      <th className="product-remove"></th>
                      <th className="product-thumbnail"></th>
                      <th className="product-name">Product</th>
                      <th className="product-price">Price</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-subtotal">Total</th>
                      <th className="product-info"></th>
                    </tr>
                  </thead>
                  <tbody>
                  {cartItems.map((item) => (
  item.type === 'fabric' && (
    <tr key={item.uniqueId} className="woocommerce-cart-form__cart-item">
      <td className="product-remove">
        <a href="#" className="remove" aria-label="Remove this item" onClick={() => handleRemoveFromCart(item.uniqueId)}>x</a>
      </td>
      <td className="product-thumbnail">
        <a href="">
          <img src="" alt="" className="attachment-woocommerce_thumbnail" />
        </a>
      </td>
      <td className="product-name">
        <a href="">{item.name}</a>
      </td>
      <td className="product-price">
        <span>{item.price} USD</span>
      </td>
      <td className="product-quantity">
        <span>{item.quantity}</span>
      </td>
      <td className="product-subtotal">
        <span>{item.price * item.quantity} USD</span>
      </td>
      <td className="product-info">
        <a href="">View Info</a>
      </td>
    </tr>
  )
))}

                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="total-price">
          <h2>Total Price of Fabrics: {totalPrice} USD</h2>
        </div>
        <button className="return-button" onClick={handleReturnToCustomization}>
          Return to Customization
        </button>
        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      <Footer/>
    </>
  );
};

export default Cart;
