import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import PayPalCheckoutButton from './paypalCheckout.jsx';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { toast } from 'react-toastify';
import './Checkout.scss';
import Address from '../../layouts/components/Address/Address.jsx';

const CHECKOUT_API = {
  confirmOrder: "https://vesttour.xyz/api/AddCart/confirmorder",
  fetchCart: "https://vesttour.xyz/api/AddCart/mycart",
  fetchStores: "https://vesttour.xyz/api/Store",
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

const useCart = () => {
  // Logic xử lý cart
};

const useShipping = () => {
  // Logic xử lý shipping
};

const validateCheckoutForm = (formData) => {
  const errors = [];
  // Validation logic
  return errors;
};

const usePayment = () => {
  // Payment processing logic
};

// const finalTotal = useMemo(() => calculateFinalTotal(), 
//   [apiCart, selectedVoucher, shippingFee]);

const Checkout = () => {
  const [apiCart, setApiCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Pick up');
  const [isPaid, setIsPaid] = useState(false);
  const [storeId, setStoreId] = useState();
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
  const [isDeposit, setIsDeposit] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');
  const [resetAddress, setResetAddress] = useState(false);
  const [orderNote, setOrderNote] = useState('');

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
                axios.get(`https://vesttour.xyz/api/Fabrics/${item.customProduct.fabricID}`),
                axios.get(`https://vesttour.xyz/api/Linings/${item.customProduct.liningID}`)
              ]);

              const styleOptionPromises = item.customProduct.styleOptionIds.map(id =>
                axios.get(`https://vesttour.xyz/api/StyleOption/${id}`)
              );
              const styleOptionResponses = await Promise.all(styleOptionPromises);

              details[item.cartItemId] = {
                fabric: {
                  name: fabricRes.data.fabricName,
                  price: fabricRes.data.price
                },
                lining: {
                  name: liningRes.data.data.liningName
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
          const cartData = response.data;
          console.log('Cart Items:', cartData.cartItems); // Log toàn bộ cart items

          setApiCart(cartData);

          // Fetch details for custom products
          const details = {};
          for (const item of cartData.cartItems) {
            if (item.isCustom && item.customProduct) {
              // Log thông tin của từng item để debug
              console.log('Processing custom item:', {
                cartItemId: item.cartItemId,
                customProduct: item.customProduct
              });

              try {
                // Fetch fabric details
                const fabricRes = await axios.get(
                  `https://vesttour.xyz/api/Fabrics/${item.customProduct.fabricID}`
                );

                // Fetch lining details
                const liningRes = await axios.get(
                  `https://vesttour.xyz/api/Linings/${item.customProduct.liningID}`
                );

                // Fetch style options details
                const styleOptionPromises = item.customProduct.pickedStyleOptions.map(option =>
                  axios.get(`https://vesttour.xyz/api/StyleOption/${option.styleOptionID}`)
                );
                const styleOptionResponses = await Promise.all(styleOptionPromises);

                // Đảm bảo cartItemId là một giá trị hợp lệ
                const productCode = item.customProduct.productCode;
                
                details[productCode] = {
                  productCode: productCode,
                  fabric: {
                    name: fabricRes.data.fabricName,
                    price: fabricRes.data.price,
                    id: item.customProduct.fabricID
                  },
                  lining: {
                    name: liningRes.data.data.liningName,
                    id: item.customProduct.liningID
                  },
                  styleOptions: styleOptionResponses.map(res => ({
                    type: res.data.optionType,
                    value: res.data.optionValue,
                    id: res.data.styleOptionID
                  }))
                };

                console.log(`Details for item ${productCode}:`, details[productCode]);
              } catch (error) {
                console.error(`Error fetching details for product:`, error);
              }
            }
          }

          console.log('All cart items:', cartData.cartItems.map(item => ({
            cartItemId: item.cartItemId,
            productCode: item.isCustom ? item.customProduct.productCode : item.product?.productCode
          })));
          
          console.log('Final details object:', details);
          setCustomDetails(details);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
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
          const response = await axios.get(`https://vesttour.xyz/api/User/${userId}`, {
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

  // useEffect(() => {
  //   console.log('Address Change Detected:', {
  //     'Phương thức giao hàng': deliveryMethod,
  //     'Địa chỉ': guestAddress,
  //     'Cửa hàng gần nhất': nearestStore,
  //     'wardCode': document.querySelector('input[name="wardCode"]')?.value,
  //     'districtId': document.querySelector('input[name="districtId"]')?.value
  //   });

  //   if (deliveryMethod === 'Delivery' && guestAddress && nearestStore) {
  //     const addressData = {
  //       wardCode: document.querySelector('input[name="wardCode"]')?.value,
  //       districtId: document.querySelector('input[name="districtId"]')?.value,
  //     };
  //     console.log(addressData);
  //     if (addressData.wardCode && addressData.districtId) {
  //       calculateShippingFee(addressData);
  //     }
  //   }
  // }, [deliveryMethod, guestAddress, nearestStore]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('https://vesttour.xyz/api/Voucher/valid');
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
      setShippingFee(2);
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
        'https://vesttour.xyz/api/Shipping/calculate-fee',
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
      setShippingFee(2);
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
    
    // Reset shipping fee và nearest store khi không phải delivery
    if (newMethod !== 'Delivery') {
      setShippingFee(0);
      setNearestStore(null);
      
      // Nếu đang áp dụng voucher FREESHIP, bỏ chọn nó
      if (selectedVoucher?.voucherCode?.substring(0, 8) === 'FREESHIP') {
        setSelectedVoucher(null);
        setDiscountedShippingFee(0);
      }
    }
  };

  const handleStoreSelect = (store) => {
    setNearestStore(store);
    setStoreId(store.storeId);
    setGuestAddress('');
    setResetAddress(true);
    console.log("Updated storeId:", store.storeId);
  };

  const handleVoucherSelect = async (voucher) => {
    // Reset states nếu không có voucher được chọn
    if (!voucher) {
      setSelectedVoucher(null);
      setDiscountedShippingFee(shippingFee);
      return;
    }

    try {
      setSelectedVoucher(voucher);
      
      // Xử lý riêng cho từng loại voucher
      if (voucher.voucherCode?.substring(0, 8) === 'FREESHIP') {
        // Logic cũ cho FREESHIP
        const discountAmount = shippingFee * voucher.discountNumber;
        setDiscountedShippingFee(shippingFee - discountAmount);
      } else if (voucher.voucherCode?.substring(0, 7) === 'BIGSALE') {
        // Đặt shipping fee về giá gốc vì BIGSALE không ảnh hưởng đến phí ship
        setDiscountedShippingFee(shippingFee);
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

  const setOrderPaid = async (orderId) => {
    try {
      const response = await axios.put(`https://vesttour.xyz/api/Orders/SetPaidTrue/${orderId}`);
      if (response.status === 200) {
        console.log('Order marked as paid successfully');
      } else {
        console.error('Failed to mark order as paid:', response.data);
      }
    } catch (error) {
      console.error('Error setting order as paid:', error);
      // toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleCreatePayment = async (orderId, userId, method, paymentDetails, amount) => {
    try {
      const response = await axios.post('https://vesttour.xyz/api/Payments', {
        orderId: orderId,
        userId: userId,
        method: method,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentDetails: paymentDetails,
        status: "Success",
        amount: amount
      });

      if (response.status === 201) {
        console.log('Payment created successfully:', response.data);
        // Call setOrderPaid after successful payment
        await setOrderPaid(orderId);
      } else {
        console.error('Payment creation failed:', response.data);
      }
    } catch (error) {
      console.error("Error creating payment:", error.response ? error.response.data : error);
      toast.error('Please fill in all required fields and try again.');
    }
  };

  const handlePaymentSuccess = async (details, data) => {
    try {
        setIsLoading(true);
        
        // Tính toán lại tổng tiền sau khi áp dụng voucher
        let finalTotal = apiCart.cartTotal;
        
        // Áp dụng BIGSALE nếu có
        if (selectedVoucher?.voucherCode?.substring(0, 7) === 'BIGSALE') {
            finalTotal = finalTotal * (1 - selectedVoucher.discountNumber);
        }
        
        // Thêm phí ship sau khi đã tính giảm giá BIGSALE
        const finalShippingFee = selectedVoucher?.voucherCode?.substring(0, 8) === 'FREESHIP' 
            ? discountedShippingFee 
            : shippingFee;
        
        finalTotal += finalShippingFee;
        
        // Tính depositAmount dựa trên tổng đã giảm giá
        const depositAmount = isDeposit ? (finalTotal * 0.5) : finalTotal;

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

        if (!guestPhone.trim()) {
            errors.push('Please enter your phone number');
        } else if (!/^\d{10}$/.test(guestPhone)) {
            errors.push('Please enter a valid phone number (10 digits)');
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
            // const wardCode = document.querySelector('input[name="wardCode"]')?.value;
            // const districtId = document.querySelector('input[name="districtId"]')?.value;
            // if (!wardCode || !districtId) {
            //     errors.push('Please select a valid delivery address with ward and district');
            // }
        }

        if (!apiCart?.cartItems?.length) {
            errors.push('Your cart is empty');
        }

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            setIsLoading(false);
            return;
        }

        const queryParams = new URLSearchParams({
            guestName: guestName,
            guestEmail: guestEmail,
            guestAddress: guestAddress,
            guestPhone: guestPhone,
            deposit: depositAmount.toString(), // Sử dụng giá đã giảm
            shippingfee: finalShippingFee.toString(),
            deliverymethod: deliveryMethod,
            storeId: storeId,
            voucherId: selectedVoucher?.voucherId || '',
            note: orderNote
        });

        const token = localStorage.getItem('token');
        const url = `${CHECKOUT_API.confirmOrder}?${queryParams.toString()}`;

        // Call confirmOrder API - không cần requestBody, tất cả params đã ở trong URL
        const response = await axios.post(url, null, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 || response.status === 201) {
            const orderId = response.data.orderId;
            const userId = localStorage.getItem('userID');
            const paymentDetails = isDeposit ? "Make deposit 50%" : "Paid full";

            // Call the new payment API
            await handleCreatePayment(
                orderId, 
                userId, 
                "Paypal", 
                paymentDetails, 
                finalTotal // Sử dụng giá đã giảm
            );

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
    let discountedTotal = baseTotal;
    
    if (selectedVoucher) {
      if (selectedVoucher.voucherCode?.substring(0, 7) === 'BIGSALE') {
        // Áp dụng giảm giá % cho tổng đơn hàng
        discountedTotal = baseTotal * (1 - selectedVoucher.discountNumber);
      }
    }

    // Tính phí ship sau khi áp dụng voucher FREESHIP (nếu có)
    const finalShippingFee = selectedVoucher?.voucherCode?.substring(0, 8) === 'FREESHIP' 
      ? discountedShippingFee 
      : shippingFee;

    return discountedTotal + finalShippingFee;
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
                        Phone Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your phone number"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Order Note</label>
                      <textarea
                        placeholder="Add any special instructions or notes for your order"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        rows="3"
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
                          {stores
                            .filter(store => store.status === "Active")
                            .map((store) => (
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
                            {stores
                              .filter(store => store.status === "Active")
                              .map((store) => (
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
                            resetAddress={resetAddress}
                            setResetAddress={setResetAddress}
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
                          <tr key={item.customProduct?.productCode || item.cartItemId}>
                            <td>
                              {item.isCustom 
                                ? item.customProduct?.productCode 
                                : item.product?.productCode || 'N/A'}
                            </td>
                            <td>
                              {item.isCustom ? (
                                <div className="product-details">
                                  {customDetails[item.customProduct.productCode] ? (
                                    <>
                                      <p><strong>Fabric:</strong> {customDetails[item.customProduct.productCode].fabric.name}</p>
                                      <p><strong>Lining:</strong> {customDetails[item.customProduct.productCode].lining.name}</p>
                                      <div className="style-options">
                                        <strong>Style Options:</strong>
                                        {customDetails[item.customProduct.productCode].styleOptions.map((option, index) => (
                                          <p key={`${item.customProduct.productCode}-${index}`}>
                                            {option.type}: {option.value}
                                          </p>
                                        ))}
                                      </div>
                                    </>
                                  ) : (
                                    <p>Loading details...</p>
                                  )}
                                </div>
                              ) : (
                                <div className="product-details">
                                  <div className="product-image">
                                    <img 
                                      src={item.product?.imgURL} 
                                      alt="Product" 
                                      style={{ width: '100px' }} 
                                    />
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
                        {selectedVoucher?.voucherCode?.substring(0, 7) === 'BIGSALE' && (
                          <tr>
                            <td colSpan="3"><strong>Discount ({selectedVoucher.description})</strong></td>
                            <td className="discount-amount">
                              <strong>-${(apiCart.cartTotal * selectedVoucher.discountNumber).toFixed(2)}</strong>
                            </td>
                          </tr>
                        )}
                        {deliveryMethod === 'Delivery' && (
                          <>
                            <tr>
                              <td colSpan="3"><strong>Shipping Fee</strong></td>
                              <td><strong>${shippingFee.toFixed(2)}</strong></td>
                            </tr>
                            {selectedVoucher?.voucherCode?.substring(0, 8) === 'FREESHIP' && (
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
                            {vouchers
                              .filter(voucher => {
                                // Chỉ hiển thị voucher đang có hiệu lực
                                if (voucher.status !== "OnGoing") return false;
                                
                                // Nếu là voucher FREESHIP, chỉ hiển thị khi delivery method là "Delivery"
                                if (voucher.voucherCode?.substring(0, 8) === 'FREESHIP') {
                                  return deliveryMethod === 'Delivery';
                                }
                                
                                // Các loại voucher khác hiển thị bình thường
                                return true;
                              })
                              .map((voucher) => (
                                <option key={voucher.voucherId} value={voucher.voucherId}>
                                  {voucher.voucherCode} - {voucher.description}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                        {deliveryMethod !== 'Delivery' && (
          <label className="deposit-label">
            <input
              type="checkbox"
              checked={isDeposit}
              onChange={(e) => setIsDeposit(e.target.checked)}
            />
            <span>Pay 50% Deposit</span>
          </label>
        )}
                        <PayPalCheckoutButton
                          amount={isDeposit ? apiCart.cartTotal * 0.5 : apiCart.cartTotal}
                          shippingFee={selectedVoucher?.voucherCode.substring(0, 8) === 'FREESHIP' 
                            ? discountedShippingFee 
                            : shippingFee}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          selectedVoucher={selectedVoucher}
                          isDeposit={isDeposit}
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