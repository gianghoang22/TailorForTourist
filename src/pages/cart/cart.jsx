import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateQuantity } from '../../utils/cartUtil.js';
import './Cart.scss';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import ProductInfoModal from './ProductInfoModal.jsx'; // Import the modal component

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = removeFromCart(productId);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleQuantityChange = (productId, delta) => {
    const updatedCart = updateQuantity(productId, delta);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    const currentCart = getCart();
    localStorage.setItem('checkoutCart', JSON.stringify(currentCart));
    navigate('/checkout');
  };

  const handleViewInfo = (item) => {
    setSelectedProduct(item); // Set the selected product for the modal
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close the modal by clearing the selected product
  };

  return (
    <>
      <Navigation />
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
                      <th className="product-name">Product</th>
                      <th className="product-fabric">Fabric</th>
                      <th className="product-style">Style</th>
                      <th className="product-lining">Lining</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-price">Total Price</th>
                      <th className="product-info"></th> {/* Column for View Info button */}
                    </tr>
                  </thead>
                  <tbody>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <tr key={item.productId} className="woocommerce-cart-form__cart-item">
                        <td className="product-remove">
                          <button onClick={() => handleRemoveFromCart(item.productId)}>x</button>
                        </td>
                        <td className="product-name">
                          <span>{item.name}</span>
                        </td>
                        <td className="product-fabric">
                          <span>{item.fabric?.name || 'N/A'}</span> {/* Display fabric name */}
                        </td>
                        <td className="product-style">
                          <span>{item.style?.name || 'N/A'}</span> {/* Display style name */}
                        </td>
                        <td className="product-lining">
                          <span>{item.lining?.name || 'N/A'}</span> {/* Display lining name */}
                        </td>
                        <td className="product-quantity">
                          <span>{item.quantity}</span>
                        </td>
                        <td className="product-price">
                          <span>{(item.price * item.quantity).toFixed(2)} USD</span>
                        </td>
                        <td className="product-info">
                          <button onClick={(event) => {
                              event.preventDefault(); // Prevent the default form submission
                              handleViewInfo(item);
                          }}>
                            View Info
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center' }}>
                        Your cart is empty.
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>Total Price of Fabrics: {totalPrice.toFixed(2)} USD</h2>
        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      {selectedProduct && ( // Render modal if a product is selected
        <ProductInfoModal product={selectedProduct} onClose={closeModal} />
      )}
      <Footer />
    </>
  );
};

export default Cart;
