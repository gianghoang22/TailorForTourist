import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PayPalCheckoutButton from './paypalCheckout.jsx';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { toast } from 'react-toastify';
import './Checkout.scss';

const CHECKOUT_API = {
  confirmOrder: "https://localhost:7194/api/AddCart/confirmorder",
  fetchCart: "https://localhost:7194/api/AddCart/mycart",
  fetchStores: "https://localhost:7194/api/Store",
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
  const [customDetails, setCustomDetails] = useState({});
  const [stores, setStores] = useState([]);
  const [nonCustomProducts, setNonCustomProducts] = useState({});
  const [userData, setUserData] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isGuest, setIsGuest] = useState(!localStorage.getItem('token'));
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(CHECKOUT_API.fetchStores);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores');
      }
    };

    const fetchCartAndDetails = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Handle guest cart
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || {
          cartItems: [],
          cartTotal: 0
        };
        setApiCart(guestCart);
        
        // Fetch details for custom products in guest cart
        const details = {};
        for (const item of guestCart.cartItems) {
          if (item.isCustom) {
            try {
              const [fabricRes, liningRes] = await Promise.all([
                axios.get(`https://localhost:7194/api/Fabrics/${item.customProduct.fabricID}`),
                axios.get(`https://localhost:7194/api/Linings/${item.customProduct.liningID}`)
              ]);

              const styleOptionPromises = item.customProduct.styleOptionIds.map(id =>
                axios.get(`https://localhost:7194/api/StyleOption/${id}`)
              );
              const styleOptionResponses = await Promise.all(styleOptionPromises);

              details[item.cartItemId] = {
                fabric: {
                  name: fabricRes.data.fabricName,
                  price: fabricRes.data.price
                },
                lining: {
                  name: liningRes.data.liningName
                },
                styleOptions: styleOptionResponses.map(res => ({
                  type: res.data.optionType,
                  value: res.data.optionValue
                }))
              };
            } catch (error) {
              console.error('Error fetching custom product details:', error);
            }
          }
        }
        setCustomDetails(details);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(CHECKOUT_API.fetchCart, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setApiCart(response.data);

          // Fetch details for custom products
          const details = {};
          for (const item of response.data.cartItems) {
            if (item.customProduct) {
              const [fabricRes, liningRes] = await Promise.all([
                axios.get(`https://localhost:7194/api/Fabrics/${item.customProduct.fabricID}`),
                axios.get(`https://localhost:7194/api/Linings/${item.customProduct.liningID}`)
              ]);

              // Fetch style options details
              const styleOptionPromises = item.customProduct.pickedStyleOptions.map(option =>
                axios.get(`https://localhost:7194/api/StyleOption/${option.styleOptionID}`)
              );
              const styleOptionResponses = await Promise.all(styleOptionPromises);

              details[item.cartItemId] = {
                fabric: {
                  name: fabricRes.data.fabricName,
                  price: fabricRes.data.price
                },
                lining: {
                  name: liningRes.data.liningName
                },
                styleOptions: styleOptionResponses.map(res => ({
                  type: res.data.optionType,
                  value: res.data.optionValue
                }))
              };
            }
          }
          setCustomDetails(details);
        }
      } catch (error) {
        setError('Đã xảy ra lỗi khi lấy giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userID');
      
      // Only fetch user data if we have both token and userId
      if (token && userId) {
        try {
          const response = await axios.get(`https://localhost:7194/api/User/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            const user = response.data;
            setUserData(user);
            // Pre-fill the form fields with user data
            setGuestName(user.name || '');
            setGuestEmail(user.email || '');
            setGuestAddress(user.address || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Don't show error toast for guests
          if (token) {
            toast.error('Failed to load user information');
          }
        }
      }
    };

    fetchStores();
    fetchCartAndDetails();
    fetchUserData();
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

  const handleCheckout = async () => {
    try {
      if (isGuest) {
        // Validate guest information
        if (!guestName || !guestEmail || (deliveryMethod === 'Delivery' && !guestAddress)) {
          toast.error('Please fill in all required fields');
          return;
        }

        const guestCart = JSON.parse(localStorage.getItem('guestCart'));
        
        // Prepare cart items for API
        const cartItems = guestCart.cartItems.map(item => {
          if (item.isCustom) {
            return {
              isCustom: true,
              customProduct: {
                categoryID: 5, // Default category for custom suits
                fabricID: item.customProduct.fabricID,
                liningID: item.customProduct.liningID,
                measurementID: parseInt(localStorage.getItem('measurementId')),
                pickedStyleOptions: item.customProduct.styleOptionIds.map(id => ({
                  styleOptionID: id
                })),
                productCode: item.customProduct.productCode
              },
              quantity: item.quantity,
              price: item.price
            };
          } else {
            return {
              isCustom: false,
              productId: item.product.productID,
              quantity: item.quantity,
              price: item.price
            };
          }
        });

        // Create guest order payload
        const orderPayload = {
          guestName,
          guestEmail,
          guestAddress,
          deliveryMethod,
          storeId: deliveryMethod === 'Pick up' ? parseInt(storeId) : null,
          shippingFee: shippingfee,
          cartItems,
          totalAmount: deliveryMethod === 'Delivery' 
            ? guestCart.cartTotal + shippingfee 
            : guestCart.cartTotal
        };

        // Show PayPal payment for guest
        setIsPaid(false); // Reset payment status
        setOrderData(orderPayload); // Store order data for after payment

      } else {
        // Existing logged-in user checkout logic
        const payload = {
          userId: parseInt(localStorage.getItem("userID")),
          deliveryMethod: deliveryMethod,
          storeId: deliveryMethod === 'Pick up' ? parseInt(storeId) : null,
          shippingFee: shippingfee,
          totalAmount: deliveryMethod === 'Delivery' 
            ? apiCart.cartTotal + shippingfee 
            : apiCart.cartTotal
        };

        const response = await axios.post(
          'https://localhost:7194/api/Order/create',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast.success('Order placed successfully!');
          setOrderComplete(true);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const getDisplayProductCode = (fullCode) => {
    if (!fullCode) return '';
    return fullCode.split('2024')[0];  // This will show just the base part like "PRD002"
  };

  const handleConfirmOrder = async () => {
    try {
      if (isGuest) {
        if (!isPaid) {
          toast.error('Please complete payment before confirming order');
          return;
        }

        // Submit guest order
        const response = await axios.post(
          'https://localhost:7194/api/Order/guest-order',
          orderData
        );

        if (response.status === 200 || response.status === 201) {
          toast.success('Order confirmed successfully!');
          localStorage.removeItem('guestCart');
          setOrderComplete(true);
          navigate('/order-success'); // Add this route if you have it
        }
      } else {
        // Existing logged-in user order confirmation
        const response = await confirmOrder(orderData);
        if (response) {
          setOrderComplete(true);
          navigate('/order-success');
        }
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Failed to confirm order. Please try again.');
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
                  <div className="billing-details">
                    <h3>Billing Details</h3>
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="deliveryMethod">Delivery Method *</label>
                      <select
                        id="deliveryMethod"
                        value={deliveryMethod}
                        onChange={(e) => {
                          setDeliveryMethod(e.target.value);
                          if (e.target.value === 'Pick up') {
                            setGuestAddress('');
                            setShippingfee(0);
                          } else {
                            setStoreId('');
                            setShippingfee(30);
                            if (userData?.address) {
                              setGuestAddress(userData.address);
                            }
                          }
                        }}
                        required
                      >
                        <option value="Pick up">Pick up at store</option>
                        <option value="Delivery">Home delivery</option>
                      </select>
                    </div>

                    {deliveryMethod === 'Pick up' ? (
                      <div className="form-group">
                        <label htmlFor="store">Select Store *</label>
                        <select
                          id="store"
                          value={storeId}
                          onChange={(e) => setStoreId(Number(e.target.value))}
                          required
                        >
                          <option value="">Select a store</option>
                          {stores.map((store) => (
                            <option key={store.storeId} value={store.storeId}>
                              {store.name} - {store.address}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label htmlFor="address">Delivery Address *</label>
                        <input
                          type="text"
                          id="address"
                          placeholder="Enter your delivery address"
                          value={guestAddress}
                          onChange={(e) => setGuestAddress(e.target.value)}
                          required
                        />
                      </div>
                    )}
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
                          <th>Details</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiCart.cartItems.map((item) => (
                          <tr key={item.cartItemId}>
                            <td>
                              {item.isCustom 
                                ? item.customProduct?.productCode 
                                : item.product?.productCode || 'N/A'}
                            </td>
                            <td>
                              {item.isCustom ? (
                                customDetails[item.cartItemId] && (
                                  <div className="product-details">
                                    <p><strong>Fabric:</strong> {customDetails[item.cartItemId].fabric.name}</p>
                                    <p><strong>Lining:</strong> {customDetails[item.cartItemId].lining.name}</p>
                                    <div className="style-options">
                                      <strong>Style Options:</strong>
                                      {customDetails[item.cartItemId].styleOptions.map((option, index) => (
                                        <p key={index}>{option.type}: {option.value}</p>
                                      ))}
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div className="product-details">
                                  <div className="product-image">
                                    <img src={item.product?.imgURL} alt="Product" style={{ width: '100px' }} />
                                  </div>
                                  <p><strong>Product Code:</strong> {getDisplayProductCode(item.product?.productCode)}</p>
                                  <p><strong>Size:</strong> {item.product?.size}</p>
                                
                                  
                                </div>
                              )}
                            </td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3"><strong>Subtotal</strong></td>
                          <td><strong>${apiCart.cartTotal}</strong></td>
                        </tr>
                        {deliveryMethod === 'Delivery' && (
                          <tr>
                            <td colSpan="3"><strong>Shipping Fee</strong></td>
                            <td><strong>${shippingfee}</strong></td>
                          </tr>
                        )}
                        <tr className="order-total">
                          <td colSpan="3"><strong>Total</strong></td>
                          <td>
                            <strong>
                              ${deliveryMethod === 'Delivery' 
                                ? (apiCart.cartTotal + shippingfee) 
                                : apiCart.cartTotal}
                            </strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    {apiCart && apiCart.cartItems.length > 0 && (
                      <PayPalCheckoutButton
                        totalPrice={deliveryMethod === 'Delivery' 
                          ? (apiCart.cartTotal + shippingfee) 
                          : apiCart.cartTotal}
                        onSuccess={async (details) => {
                          try {
                            let response;
                            if (isGuest) {
                              // Submit guest order after successful payment
                              response = await axios.post(
                                'https://localhost:7194/api/Order/guest-order',
                                orderData
                              );
                            } else {
                              // ... existing logged-in order submission ...
                            }

                            if (response.status === 200 || response.status === 201) {
                              toast.success('Order placed successfully!');
                              localStorage.removeItem('guestCart'); // Clear guest cart
                              setOrderComplete(true);
                            }
                          } catch (error) {
                            console.error('Error completing order:', error);
                            toast.error('Failed to complete order. Please contact support.');
                          }
                        }}
                        onError={(err) => {
                          console.error('Payment error:', err);
                          toast.error('Payment failed. Please try again.');
                        }}
                      />
                    )}
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
      <Footer />
    </>
  );
};

export default Checkout;
