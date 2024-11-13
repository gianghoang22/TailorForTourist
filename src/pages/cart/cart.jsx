// import React from 'react';
// import { getCart, removeFromCart } from '../../utils/cartUtil';
// import './Cart.scss';
// import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
// import { Footer } from '../../layouts/components/footer/Footer.jsx';

// const Cart = () => {
//   const [cart, setCart] = React.useState([]);

//   React.useEffect(() => {
//     setCart(getCart());
//   }, []);

//   const handleRemoveItem = (itemId) => {
//     removeFromCart(itemId);
//     setCart(getCart());
//   };

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => {
//       if (item.type === 'suit' && item.price) {
//         return total + item.price;
//       }
//       return total;
//     }, 0);
//   };

//   const renderSuitDetails = (suit) => {
//     const suitCode = suit.fabric ? `SUIT ${suit.fabric.name.toUpperCase().replace(/\s+/g, ' ')}` : 'SUIT_INCOMPLETE';
    
//     return (
//       <div className="cart-item">
//         <div className="suit-header">
//           <h3>{suitCode}</h3>
//           <p className="suit-price">Price: ${suit.price}</p>
//         </div>
//         <div className="suit-components">
//           {suit.fabric && (
//             <div className="component product-thumbnail">
//               <h4>Fabric:</h4>
//               <img src={suit.fabric.imageUrl} alt={suit.fabric.name} />
//               <p>{suit.fabric.name}</p>
//             </div>
//           )}
          
//           {suit.style && (
//             <div className="component product-info">
//               <h4>Style:</h4>
//               <img src={suit.style.imageUrl} alt={suit.style.optionValue} />
//               <p>{suit.style.optionType}: {suit.style.optionValue}</p>
//             </div>
//           )}
          
//           {suit.lining && (
//             <div className="component">
//               <h4>Lining:</h4>
//               <img src={suit.lining.imageUrl} alt={suit.lining.name} />
//               <p>{suit.lining.name}</p>
//             </div>
//           )}
//         </div>
//         <div className="product-remove">
//           <button className="remove-btn" onClick={() => handleRemoveItem(suit.id)}>Remove</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navigation />
//       <div className="page-with-side-bar">
//         <div className="all">
//           <div className="left-side">
//             <div className="sec-title">
//               <h1 className="tt-txt">
//                 <span className="tt-sub">Cart</span>
//                 A Dong Silk
//               </h1>
//             </div>
//           </div>
//           <div className="right-main woocommerce">
//             {cart.length === 0 ? (
//               <p>Your cart is empty</p>
//             ) : (
//               <div className="woocommerce-cart-form">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Price</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cart.map((item) => (
//                       <tr key={item.id}>
//                         <td>{item.type === 'suit' && renderSuitDetails(item)}</td>
//                         <td className="product-price">${item.price}</td>
//                         <td className="product-remove">
//                           <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div className="cart-collaterals">
//                   <div className="cart-totals">
//                     <h2>Total:</h2>
//                     <p className="total-price">${calculateTotal()}</p>
//                     <button className="checkout-button">Proceed to Checkout</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;


import React from 'react';
import { getCart, removeFromCart } from '../../utils/cartUtil';
import { useNavigate } from 'react-router-dom';
import './Cart.scss';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';

const Cart = () => {
  const [cart, setCart] = React.useState([]);
  const [modalSuit, setModalSuit] = React.useState(null); // For modal details
  const navigate = useNavigate();

  React.useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    setCart(getCart());
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'suit' && item.price) {
        return total + item.price;
      }
      return total;
    }, 0);
  };

  const handleCheckout = () => {
    const currentCart = getCart();
    localStorage.setItem('checkoutCart', JSON.stringify(currentCart));
    navigate('/checkout');
  };


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

          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Fabric</th>
                    <th>Style</th>
                    <th>Lining</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    item.type === 'suit' && (
                      <tr key={item.id}>
                        <td>{item.fabric ? item.fabric.name : 'N/A'}</td>
                        <td>
                          {item.style ? `${item.style.optionType}: ${item.style.optionValue}` : 'N/A'}
                        </td>
                        <td>{item.lining ? item.lining.name : 'N/A'}</td>
                        <td>${item.price}</td>
                        <td>
                          <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                          <button className="detail-btn" onClick={() => setModalSuit(item)}>View Details</button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>

              <div className="cart-summary">
                <div className="total">
                  <h3>Total:</h3>
                  <p>${calculateTotal()}</p>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to checkout
          </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal for suit details */}
      {modalSuit && (
        <div className="modal" onClick={() => setModalSuit(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setModalSuit(null)}>&times;</span>
            <h2>Suit Details</h2>
            <div className="suit-components">
              {modalSuit.fabric && (
                <div className="component">
                  <h4>Fabric:</h4>
                  <p>{modalSuit.fabric.name}</p>
                </div>
              )}
              {modalSuit.style && (
                <div className="component">
                  <h4>Style:</h4>
                  <p>{modalSuit.style.optionType}: {modalSuit.style.optionValue}</p>
                </div>
              )}
              {modalSuit.lining && (
                <div className="component">
                  <h4>Lining:</h4>
                  <p>{modalSuit.lining.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
