import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PayPalCheckoutButton from './paypalCheckout.jsx';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { toast } from 'react-toastify';
import './Checkout.scss';

const CHECKOUT_API = {
  confirmOrder: "https://localhost:7194/api/AddCart/confirmorder",
  fetchCart: "https://localhost:7194/api/AddCart/mycart",
};

const Checkout = () => {
  const [apiCart, setApiCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [shippingfee, setShippingfee] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('Pick up');
  const [isPaid, setIsPaid] = useState(false);
  const [voucherId, setVoucherId] = useState(11);
  const [storeId, setStoreId] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Bạn chưa đăng nhập');
          setLoading(false);
          return;
        }

        const response = await axios.get(CHECKOUT_API.fetchCart, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response);

        if (response.status === 200) {
          setApiCart(response.data);
        } else {
          setError('Không thể tải giỏ hàng');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi lấy giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const confirmOrder = async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Bạn chưa đăng nhập');

      const response = await axios.post(CHECKOUT_API.confirmOrder, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Đơn hàng đã được xác nhận thành công!');
        return response.data;
      } else {
        throw new Error('Xác nhận đơn hàng thất bại');
      }
    } catch (err) {
      toast.error('Xác nhận đơn hàng thất bại, vui lòng thử lại');
      throw err;
    }
  };

  const handleConfirmOrder = async () => {
    if (!apiCart || !apiCart.cartItems || apiCart.cartItems.length === 0) {
      toast.success('Không có sản phẩm trong giỏ hàng để xác nhận');
      return;
    }

    const orderData = {
      guestName,
      guestEmail,
      guestAddress,
      deposit,
      shippingfee,
      deliveryMethod,
      voucherId,
      storeId,
    };

    console.log(orderData);

    console.log('deliveryMethod: ', deliveryMethod, typeof deliveryMethod);

    try {
      await confirmOrder(orderData);
      navigate('/checkout/order-confirm');
    } catch (err) {
      console.error('Error confirming order:', err);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navigation />
      <div className="page-with-side-bar">
        <div className="checkout-container">
          <div className="left-side">
            <div className="sec-title">
              <h1 className="tt-txt">
                <span className="tt-sub">Checkout</span> MATCHA Vest
              </h1>
            </div>
          </div>

          <div className="right-main">
            <div className="woocommerce">
              <div id="customer_details" className="col2-set">
                <div className="col1-set">
                  <h3>Billing Details</h3>
                  <div className="woocommerce-billing-fields">
                    <input
                      type="text"
                      placeholder="Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={guestAddress}
                      onChange={(e) => setGuestAddress(e.target.value)}
                      required
                    />
                    {/* <input
                      type="number"
                      placeholder="Deposit"
                      value={deposit}
                      onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Shipping Fee"
                      value={shippingfee}
                      onChange={(e) => setShippingfee(parseFloat(e.target.value) || 0)}
                      required
                    />
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      required
                    >
                      <option value="Pick up">Pick up</option>
                      <option value="Delivery">Delivery</option>
                    </select> */}
                  </div>
                </div>
              </div>

              <h3>Your Order</h3>
              <div id="order_review">
                {apiCart && apiCart.cartItems.length > 0 ? (
                  <>
                    <table className="shop_table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiCart.cartItems.map((item) => (
                          <tr key={item.cartItemId}>
                            <td>
        {item.isCustom
          ? item.customProduct?.productCode || "Custom Product"
          : item.product?.productCode || "Non-Custom Product"}
      </td>
      <td>${item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="cart-total">
                      <strong>Total Price:</strong> ${apiCart.cartTotal}
                    </div>
                    <PayPalCheckoutButton
                      cartItems={apiCart.cartItems}
                      totalPrice={apiCart.cartTotal}
                      onSuccess={(details) => {
                        alert('Thanh toán thành công!');
                        console.log(details);
                        console.log(details.id);
                        console.log(details.status);
                        setIsPaid(true); // Đánh dấu thanh toán thành công
                      }}
                      onError={(err) => {
                        alert('Thanh toán thất bại!');
                        console.error(err);
                        setIsPaid(false); // Đánh dấu thanh toán thất bại
                      }}
                    />
                  </>
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
              <button
                type="button"
                className="button-confirm-order"
                onClick={handleConfirmOrder}
                disabled={!isPaid} // Chỉ bật nút khi đã thanh toán thành công
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
