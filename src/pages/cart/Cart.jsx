import React, { useContext } from 'react';
import CartContext from '../../context/CartContext.js';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <h2>Giỏ Hàng</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn trống.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - {item.price} VND
              <button onClick={() => removeFromCart(item.id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
