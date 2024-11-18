import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart as removeCustomProduct } from '../../utils/cartUtil';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.scss';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart as removeNonCustomProduct } from '../../redux/slice/cartSlice.js';

const Cart = () => {
  const [customCart, setCustomCart] = useState([]);
  const navigate = useNavigate();
  const nonCustomCart = useSelector((state) => state.cart.items); 
  const dispatch = useDispatch();

  const refreshCustomCart = () => {
    setCustomCart(getCart());
  };

  useEffect(() => {
    refreshCustomCart();
  }, []);

  const handleRemoveItem = (itemId, isCustom) => {
    if (isCustom) {
      removeCustomProduct(itemId);
      refreshCustomCart();
    } else {
      dispatch(removeNonCustomProduct(itemId));
    }
  };

  const calculateTotal = () => {
    const customTotal = customCart.reduce((total, item) => item.price ? total + item.price : total, 0);
    const nonCustomTotal = nonCustomCart.reduce((total, item) => item.price ? total + item.price : total, 0);
    return customTotal + nonCustomTotal;
  };

  const handleCheckout = () => {
    const checkoutCart = [...customCart, ...nonCustomCart];
    localStorage.setItem('checkoutCart', JSON.stringify(checkoutCart));
    localStorage.setItem('totalPrice', calculateTotal()); 
    navigate('/checkout');
  };

  const totalPrice = calculateTotal();

  return (
    <>
      <Navigation />
      <div className="page-with-side-bar">
        <div className="all">
          <div className="left-side">
            <div className='sec-title'>
              <h1 className="tt-txt">
                <span className="tt-sub">Cart</span> A Dong Silk
              </h1>
            </div>
          </div>


          {(customCart.length === 0 && nonCustomCart.length === 0) ? (
            <div className="woocommerce">
              <p className='cart-empty'>Your cart is currently empty.</p>
              <p className="return-to-shop">
                <Link to='/custom-suits'>Return to shop.</Link>
              </p>
            </div>
          ) : (
            <>
            <div className="right-main">
              <div className="woocommerce">

              <table className="cart_table">
                <thead>
                  <tr>
                    <th className='product-name'>Product</th>
                    <th className='product-style'>Style</th>
                    <th className='product-lining'>Lining</th>
                    <th className='product-price'>Price</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {customCart.map((item) => (
                    item.type === 'SUIT' && (
                      <tr key={item.id}>
                        <td className='product-name'>SUIT - {item.fabric ? item.fabric.name : 'N/A'}</td>
                        <td className='product-style'>
                          {item.styles && item.styles.length > 0 ? (
                            item.styles.map((style, index) => (
                              <div key={index}>
                                {style.optionType}: {style.optionValue}
                              </div>
                            ))
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className='product-lining'>{item.lining ? item.lining.name : 'N/A'}</td>
                        <td className='product-price'>${item.price}</td>
                        <td>
                          <button className="remove-btn" onClick={() => handleRemoveItem(item.id, true)}>Remove</button>
                        </td>
                      </tr>
                    )
                  ))}
                  {nonCustomCart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>
                        <button className="remove-btn" onClick={() => handleRemoveItem(item.id, false)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-collaterals" id='total-cart'>
                <div className="cart_totals">
                  <h2>Cart totals</h2>
                  <table className="cart_table">
                    <tbody>
                      <tr className='cart-subtotal'>
                        <th>Subtotal</th>
                        <td>
                          <span className="amount">
                            {totalPrice}&nbsp;
                            <span className='currency-symbol'>USD</span>
                          </span>
                        </td>
                      </tr>

                      <tr className="order-total">
  <th>Total</th>
  <td data-title="Total">
    <strong>
      <span className="woocommerce-Price-amount amount">
        {totalPrice}&nbsp;
        <span className="woocommerce-Price-currencySymbol">USD</span>
      </span>
    </strong>
  </td>
</tr>
                    </tbody>
                  </table>
                
                <div className="wc-proceed-to-checkout">
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to checkout
                </button>
                </div>
                </div>
              </div>
              </div>
          </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
