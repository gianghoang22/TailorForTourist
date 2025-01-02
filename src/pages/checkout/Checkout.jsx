import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PayPalCheckoutButton from './paypalCheckout.jsx';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { toast } from 'react-toastify';
import './Checkout.scss';
import Address from '../../layouts/components/Address/Address.jsx';

const CHECKOUT_API = {
  confirmOrder: "https://localhost:7194/api/AddCart/confirmorder",
  fetchCart: "https://localhost:7194/api/AddCart/mycart",
  fetchStores: "https://localhost:7194/api/Store",
};

const EXCHANGE_API_KEY = '6aa988b722d995b95e483312';

const convertVNDToUSD = async (amountInVND) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/VND`);
    if (response.status === 200) {
      const usdRate = response.data.conversion_rates.USD;
      const amountInUSD = amountInVND * usdRate;
      return Number(amountInUSD.toFixed(2));
    }
    throw new Error('Failed to fetch exchange rate');
  } catch (error) {
    console.error('Error converting VND to USD:', error);
    // Fallback to approximate rate if API fails
    const fallbackRate = 0.00004; // Approximately 1 USD = 25,000 VND
    return Number((amountInVND * fallbackRate).toFixed(2));
  }
};

const Checkout = () => {
  const [apiCart, setApiCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Pick up');
  const [isPaid, setIsPaid] = useState(false);
  const [storeId, setStoreId] = useState(1);
  const navigate = useNavigate();
  const [customDetails, setCustomDetails] = useState({});
  const [stores, setStores] = useState([]);
  const [nonCustomProducts, setNonCustomProducts] = useState({});
  const [userData, setUserData] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isGuest, setIsGuest] = useState(!localStorage.getItem('token'));
  const [orderData, setOrderData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [nearestStore, setNearestStore] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountedShippingFee, setDiscountedShippingFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    console.log('Address Change Detected:', {
      'Phương thức giao hàng': deliveryMethod,
      'Địa chỉ': guestAddress,
      'Cửa hàng gần nhất': nearestStore,
      'wardCode': document.querySelector('input[name="wardCode"]')?.value,
      'districtId': document.querySelector('input[name="districtId"]')?.value
    });

    if (deliveryMethod === 'Delivery' && guestAddress && nearestStore) {
      const addressData = {
        wardCode: document.querySelector('input[name="wardCode"]')?.value,
        districtId: document.querySelector('input[name="districtId"]')?.value,
      };
      if (addressData.wardCode && addressData.districtId) {
        calculateShippingFee(addressData);
      }
    }
  }, [deliveryMethod, guestAddress, nearestStore]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('https://localhost:7194/api/Voucher/valid');
        if (response.status === 200) {
          setVouchers(response.data);
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        toast.error('Failed to load vouchers');
      }
    };

    fetchVouchers();
  }, []);

  const getDisplayProductCode = (fullCode) => {
    if (!fullCode) return '';
    return fullCode.split('2024')[0];  // This will show just the base part like "PRD002"
  };

  const calculateShippingFee = async (addressData) => {
    console.log('Calculating Shipping Fee with data:', addressData);
    
    if (!addressData?.wardCode || !addressData?.districtId || !nearestStore) {
      console.log('Missing required data:', {
        wardCode: addressData?.wardCode,
        districtId: addressData?.districtId,
        nearestStore: nearestStore
      });
      setShippingFee(0);
      return;
    }

    try {
      const shippingPayload = {
        serviceId: 0,
        insuranceValue: 0,
        coupon: "",
        toWardCode: addressData.wardCode,
        toDistrictId: parseInt(addressData.districtId),
        fromDistrictId: nearestStore.districtID,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        shopCode: nearestStore.storeCode
      };

      console.log('Shipping Fee Payload:', shippingPayload);

      const response = await axios.post(
        'https://localhost:7194/api/Shipping/calculate-fee',
        shippingPayload
      );

      if (response.data) {
        console.log('Shipping Fee Response (VND):', response.data.total);
        const shippingFeeVND = response.data.total || 0;
        const shippingFeeUSD = await convertVNDToUSD(shippingFeeVND);
        console.log('Shipping Fee (USD):', shippingFeeUSD);
        setShippingFee(shippingFeeUSD);
      }
    } catch (error) {
      console.error('Lỗi tính phí vận chuyển:', error);
    }
  };

  const handleAddressChange = (addressData) => {
    console.log('Address Data Received in Checkout:', addressData);
    // Kiểm tra xem có đủ dữ liệu không
    if (addressData?.wardCode && addressData?.districtId) {
      setGuestAddress(addressData.fullAddress);
      calculateShippingFee({
        wardCode: addressData.wardCode,
        districtId: addressData.districtId
      });
    }
  };

  const handleDeliveryMethodChange = (e) => {
    const newMethod = e.target.value;
    setDeliveryMethod(newMethod);
    if (newMethod !== 'Delivery') {
      setShippingFee(0);
      setNearestStore(null);
    }
  };

  const handleStoreSelect = (store) => {
    setNearestStore(store);
    if (guestAddress) {
      calculateShippingFee({
        wardCode: document.querySelector('input[name="wardCode"]')?.value,
        districtId: document.querySelector('input[name="districtId"]')?.value,
      });
    }
  };

  const handleVoucherSelect = async (voucher) => {
    // Reset states if no voucher is selected
    if (!voucher) {
      setSelectedVoucher(null);
      setDiscountedShippingFee(shippingFee);
      return;
    }

    try {
      setSelectedVoucher(voucher);
      if (voucher.voucherCode?.substring(0, 8) === 'FREESHIP') {
        const discountAmount = shippingFee * voucher.discountNumber;
        setDiscountedShippingFee(shippingFee - discountAmount);
      } else {
        setDiscountedShippingFee(shippingFee);
      }
      toast.success('Voucher applied successfully');
    } catch (error) {
      console.error('Error applying voucher:', error);
      setSelectedVoucher(null);
      setDiscountedShippingFee(shippingFee);
      toast.error('Failed to apply voucher. Please try again.');
    }
  };

  const handleCreatePayment = async (isDeposit, payAmount) => {
    try {
        const token = localStorage.getItem('token');

        // Tạo query parameters
        const queryParams = new URLSearchParams({
            isDeposit: isDeposit, // Truyền giá trị boolean trực tiếp
            payAmount: payAmount, // Truyền giá trị số
        }).toString();

        // Gọi API với query parameters và headers chứa token
        const response = await axios.post(`https://localhost:7194/Cart/createpayment?${queryParams}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Check if response.data and paymentId are defined
        if (response.data && response.data.paymentId) {
            sessionStorage.setItem('paymentId', response.data.paymentId);
            console.log('Payment ID saved to sessionStorage:', response.data.paymentId);
        } else {
            console.error('Payment ID not found in response:', response.data);
            toast.error('Payment creation failed. Payment ID is missing.');
        }
        
        // Xử lý phản hồi nếu cần
        console.log("Payment created successfully:", response.data);
    } catch (error) {
        console.error("Error creating payment:", error.response ? error.response.data : error);
        toast.error('Payment creation failed. Please try again.');
    }
  };

  const handlePaymentSuccess = async (details, data) => {
    var paymentId = sessionStorage.getItem('paymentId');
    try {
        setIsLoading(true);
        
        // Use the depositAmount from the details
        const depositAmount = details.depositAmount; // Get the deposit amount

        // Validation checks
        const errors = [];

        if (!guestName.trim()) {
            errors.push('Please enter your full name');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!guestEmail.trim()) {
            errors.push('Please enter your email');
        } else if (!emailRegex.test(guestEmail)) {
            errors.push('Please enter a valid email address');
        }

        if (deliveryMethod === 'Pick up') {
            if (!storeId) {
                errors.push('Please select a store for pick up');
            }
        } else if (deliveryMethod === 'Delivery') {
            if (!guestAddress.trim()) {
                errors.push('Please enter your delivery address');
            }
            if (!nearestStore) {
                errors.push('Please select the nearest store');
            }
            const wardCode = document.querySelector('input[name="wardCode"]')?.value;
            const districtId = document.querySelector('input[name="districtId"]')?.value;
            if (!wardCode || !districtId) {
                errors.push('Please select a valid delivery address with ward and district');
            }
        }

        if (!apiCart?.cartItems?.length) {
            errors.push('Your cart is empty');
        }

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            setIsLoading(false);
            return;
        }

        const finalShippingFee = selectedVoucher?.voucherCode?.substring(0, 8) === 'FREESHIP' 
            ? discountedShippingFee 
            : shippingFee;

        const cartItems = apiCart?.cartItems || [];
        
        const requestBody = {
            cartItems: cartItems.map(item => {
                if (item.isCustom) {
                    return {
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price) || 0,
                        isCustom: true,
                        customProduct: {
                            productCode: item.customProduct.productCode,
                            categoryID: parseInt(item.customProduct.categoryID),
                            fabricID: parseInt(item.customProduct.fabricID),
                            liningID: parseInt(item.customProduct.liningID),
                            measurementID: parseInt(item.customProduct.measurementID),
                            pickedStyleOptions: item.customProduct.pickedStyleOptions.map(opt => ({
                                styleOptionID: parseInt(opt.styleOptionID)
                            }))
                        },
                    };
                } else {
                    return {
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price) || 0,
                        isCustom: false,
                        product: {
                            productID: parseInt(item.product.productID),
                            productCode: item.product.productCode,
                            categoryID: parseInt(item.product.categoryID),
                            size: item.product.size,
                            price: parseFloat(item.product.price) || 0,
                            imgURL: item.product.imgURL
                        }
                    };
                }
            })
        };

        const queryParams = new URLSearchParams({
            guestName: guestName.trim(),
            guestEmail: guestEmail.trim(),
            guestAddress: guestAddress.trim(),
            deposit: depositAmount.toString(), // Pass the deposit amount as a string
            shippingfee: finalShippingFee.toString(),
            deliverymethod: deliveryMethod,
            storeId: storeId.toString()
        });

        if (selectedVoucher && selectedVoucher.voucherId) {
            queryParams.append('voucherId', selectedVoucher.voucherId.toString());
        }

        const token = localStorage.getItem('token');
        const url = `${CHECKOUT_API.confirmOrder}?${queryParams.toString()}`;

        // Tính toán số tiền thanh toán
        const payAmount = details.isDeposit ? details.depositAmount : apiCart.cartTotal;

        // Gọi hàm handleCreatePayment với payAmount đã được xác định
        await handleCreatePayment(details.isDeposit, payAmount);

        // Gọi API confirmOrder sau khi thanh toán đã được xử lý
        const response = await axios.post(
            url, requestBody, {
                headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 || response.status === 201) {
            setIsPaid(true);
            setPaymentDetails(details);
            toast.success('Order confirmed successfully!');
            if (isGuest) {
                localStorage.removeItem('guestCart');
            }
            setOrderComplete(true);
            navigate('/checkout/order-confirm');
        }
    } catch (error) {
        console.error('Error confirming order:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        toast.error(
            error.response?.data?.message || 
            error.response?.data?.title ||
            'Failed to confirm order. Please try again.'
        );
    } finally {
        setIsLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  const handlePaymentCancel = () => {
    toast.info('Payment cancelled.');
  };

  // Add this function to calculate the final total
  const calculateFinalTotal = () => {
    const baseTotal = apiCart.cartTotal;
    const finalShippingFee = selectedVoucher?.voucherCode.substring(0, 8) === 'FREESHIP' 
      ? discountedShippingFee 
      : shippingFee;
    return baseTotal + finalShippingFee;
  };

  if (isLoading) {
    return (
      <h1 className="loading-message">Your order is being confirmed, please wait.</h1>
    );
  }
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
                      <label>
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Delivery Method <span className="required">*</span>
                      </label>
                      <select
                        value={deliveryMethod}
                        onChange={handleDeliveryMethodChange}
                        required
                      >
                        <option value="Pick up">Pick up at store</option>
                        <option value="Delivery">Home delivery</option>
                      </select>
                    </div>

                    {deliveryMethod === 'Pick up' ? (
                      <div className="form-group">
                        <label>
                          Select Store <span className="required">*</span>
                        </label>
                        <select
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
                      <>
                        <div className="form-group">
                          <label>
                            Select Nearest Store <span className="required">*</span>
                          </label>
                          <select
                            value={nearestStore?.storeId || ''}
                            onChange={(e) => {
                              const selected = stores.find(s => s.storeId === Number(e.target.value));
                              handleStoreSelect(selected);
                            }}
                            required
                          >
                            <option value="">Select nearest store</option>
                            {stores.map((store) => (
                              <option key={store.storeId} value={store.storeId}>
                                {store.name} - {store.address}
                              </option>
                            ))}
                          </select>
                        </div>

                        {nearestStore && (
                          <div className="selected-store-info">
                            <h4>Selected Store:</h4>
                            <p><strong>{nearestStore.name}</strong></p>
                            <p>{nearestStore.address}</p>
                          </div>
                        )}

                        <div className="form-group">
                          <label>
                            Delivery Address <span className="required">*</span>
                          </label>
                          <Address 
                            initialAddress={userData?.address} 
                            onAddressChange={handleAddressChange}
                          />
                        </div>
                      </>
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
                          <td><strong>${apiCart.cartTotal.toFixed(2)}</strong></td>
                        </tr>
                        {deliveryMethod === 'Delivery' && (
                          <>
                            <tr>
                              <td colSpan="3"><strong>Shipping Fee</strong></td>
                              <td><strong>${shippingFee.toFixed(2)}</strong></td>
                            </tr>
                            {selectedVoucher && selectedVoucher.voucherCode.substring(0, 8) === 'FREESHIP' && (
                              <tr>
                                <td colSpan="3"><strong>Shipping Discount</strong></td>
                                <td className="discount-amount">
                                  <strong>-${(shippingFee - discountedShippingFee).toFixed(2)}</strong>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                        <tr className="order-total">
                          <td colSpan="3"><strong>Total</strong></td>
                          <td>
                            <strong>${calculateFinalTotal().toFixed(2)}</strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    {apiCart && apiCart.cartItems.length > 0 && (
                      <>
                        <div className="voucher-section">
                          <h4>Available Vouchers</h4>
                          <select 
                            onChange={(e) => {
                              const voucher = vouchers.find(v => v.voucherId === parseInt(e.target.value));
                              handleVoucherSelect(voucher);
                            }}
                            value={selectedVoucher?.voucherId || ''}
                          >
                            <option value="">Select a voucher</option>
                            {vouchers.map((voucher) => (
                              <option key={voucher.voucherId} value={voucher.voucherId}>
                                {voucher.voucherCode} - {voucher.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <PayPalCheckoutButton
                          amount={apiCart.cartTotal}
                          shippingFee={selectedVoucher?.voucherCode.substring(0, 8) === 'FREESHIP' 
                            ? discountedShippingFee 
                            : shippingFee}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          selectedVoucher={selectedVoucher}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isLoading && <div className="loading-spinner">Processing your order...</div>}
    </>
  );
};

export default Checkout;