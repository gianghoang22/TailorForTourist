import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cart.scss";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "../../layouts/components/navigation/Navigation.jsx";
import { Footer } from "../../layouts/components/footer/Footer.jsx";
import { toast } from "react-toastify";


const Cart = () => {
  const [apiCart, setApiCart] = useState(null);
  const [customDetails, setCustomDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(!localStorage.getItem("token"));
  const [details, setDetails] = useState({});

  useEffect(() => {
    const fetchCartAndDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Handle guest cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
          cartItems: [],
          cartTotal: 0,
        };
        setApiCart(guestCart);

        // Fetch details for items in guest cart
        const details = {};
        for (const item of guestCart.cartItems) {
          if (item.isCustom) {
            try {
              const [fabricRes, liningRes] = await Promise.all([
                axios.get(
                  `https://vesttour.xyz/api/Fabrics/${item.customProduct.fabricID}`
                ),
                axios.get(
                  `https://vesttour.xyz/api/Linings/${item.customProduct.liningID}`
                ),
              ]);

              // For guest cart, styleOptionIds is used instead of pickedStyleOptions
              const styleOptionPromises = item.customProduct.styleOptionIds.map(
                (id) =>
                  axios.get(`https://vesttour.xyz/api/StyleOption/${id}`)
              );
              const styleOptionResponses =
                await Promise.all(styleOptionPromises);

              details[item.cartItemId] = {
                fabric: {
                  name: fabricRes.data.fabricName,
                  price: fabricRes.data.price,
                  imageUrl: fabricRes.data.imageUrl,
                },
                lining: {
                  name: liningRes.data.data.liningName,
                  imageUrl: liningRes.data.data.imageUrl,
                },
                styleOptions: styleOptionResponses.map((res) => ({
                  type: res.data.optionType,
                  value: res.data.optionValue,
                })),
              };
            } catch (error) {
              console.error("Error fetching custom product details:", error);
            }
          }
        }
        setCustomDetails(details);
        setLoading(false);
        return;
      }

      try {
        // Fetch cart data
        const cartResponse = await axios.get("https://vesttour.xyz/api/AddCart/mycart", {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` // Kiểm tra token
          },
        });

        if (cartResponse.status === 200) {
          setApiCart(cartResponse.data);

          // Fetch details for custom products
          const details = {};
          for (const item of cartResponse.data.cartItems) {
            if (item.customProduct) {
              const [fabricRes, liningRes] = await Promise.all([
                axios.get(
                  `https://vesttour.xyz/api/Fabrics/${item.customProduct.fabricID}`
                ),
                axios.get(
                  `https://vesttour.xyz/api/Linings/${item.customProduct.liningID}`
                ),
              ]);

              // Fetch style options details
              const styleOptionPromises =
                item.customProduct.pickedStyleOptions.map((option) =>
                  axios.get(
                    `https://vesttour.xyz/api/StyleOption/${option.styleOptionID}`
                  )
                );
              const styleOptionResponses =
                await Promise.all(styleOptionPromises);

              details[item.customProduct.productCode] = {
                fabric: {
                  name: fabricRes.data.fabricName,
                  price: fabricRes.data.price,
                  imageUrl: fabricRes.data.imageUrl,
                },
                lining: {
                  name: liningRes.data.data.liningName,
                  imageUrl: liningRes.data.data.imageUrl,
                },
                styleOptions: styleOptionResponses.map((res) => ({
                  type: res.data.optionType,
                  value: res.data.optionValue,
                })),
              };
            }
          }
          setDetails(details);
        }
      } catch (error) {
        setError("Đã xảy ra lỗi khi lấy giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndDetails();
  }, []);

  const getDisplayProductCode = (fullCode) => {
    if (!fullCode) return "";
    return fullCode.split("2024")[0]; 
  };

  const removeFromCart = async (productCode) => {
    if (isGuest) {
      removeFromGuestCart(productCode);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userId = parseInt(localStorage.getItem("userID"));

      if (!token) {
        toast.error("Bạn chưa đăng nhập");
        return;
      }

      console.log("Removing product:", { productCode, userId }); // Debug log

      const response = await axios.delete(
        `https://vesttour.xyz/api/AddCart/remove/${productCode}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Fetch updated cart data after removal
        const updatedCartResponse = await axios.get(
          "https://vesttour.xyz/api/AddCart/mycart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (updatedCartResponse.status === 200) {
          setApiCart(updatedCartResponse.data);
          toast.success("The product is removed!");
        }
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleQuantityChange = async (productCode, action) => {
    if (isGuest) {
      handleGuestQuantityChange(productCode, action);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Bạn chưa đăng nhập");
        return;
      }

      const endpoint =
        action === "increase"
          ? `https://vesttour.xyz/api/AddCart/increase/${productCode}`
          : `https://vesttour.xyz/api/AddCart/decrease/${productCode}`;

      const response = await axios.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Fetch updated cart data after quantity change
        const updatedCartResponse = await axios.get(
          "https://vesttour.xyz/api/AddCart/mycart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (updatedCartResponse.status === 200) {
          setApiCart(updatedCartResponse.data);
        }
      }
    } catch (error) {
      console.error("Error changing quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const addToGuestCart = (product, isCustom = false) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
      cartItems: [],
      cartTotal: 0,
    };

    const cartItemId = Date.now(); // Generate unique ID
    const newItem = {
      cartItemId,
      quantity: 1,
      price: product.price,
      isCustom,
      product: isCustom ? null : product,
      customProduct: isCustom ? product : null,
    };

    guestCart.cartItems.push(newItem);
    guestCart.cartTotal = guestCart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    setApiCart(guestCart);
  };

  const handleGuestQuantityChange = (productCode, action) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"));
    const item = guestCart.cartItems.find(
      (item) =>
        (item.isCustom
          ? item.customProduct.productCode
          : item.product.productCode) === productCode
    );

    if (item) {
      if (action === "increase") {
        item.quantity += 1;
      } else if (action === "decrease" && item.quantity > 1) {
        item.quantity -= 1;
      }

      guestCart.cartTotal = guestCart.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setApiCart(guestCart);
    }
  };

  const removeFromGuestCart = (productCode) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"));
    guestCart.cartItems = guestCart.cartItems.filter(
      (item) =>
        (item.isCustom
          ? item.customProduct.productCode
          : item.product.productCode) !== productCode
    );
    guestCart.cartTotal = guestCart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    setApiCart(guestCart);
    toast.success("Product removed from cart");
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
                MATCHA Vest
              </h1>
            </div>
          </div>

          {loading ? (
            <p>Loading cart...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : apiCart && apiCart.cartItems && apiCart.cartItems.length > 0 ? (
            // right info
            <div className="right-main">
              <table className="shop_table shop_table_responsive cart woocommerce-cart-form__contents">
                <thead>
                  <tr>
                    <th className="product-thumbnail"></th>
                    <th className="product-name">Product</th>
                    <th className="product-price">Price</th>
                    <th className="product-quantity">Quantity</th>
                    <th className="product-subtotal">Total</th>
                    <th className="product-note">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {apiCart.cartItems.map((item) => (
                    <tr
                      key={item.cartItemId}
                      className="woocommerce-cart-form__cart-item cart_item"
                    >
                      <td className="product-thumbnail">
                        <img
                          width="64"
                          height="817"
                          src={
                            item.isCustom && details[item.customProduct.productCode]
                              ? details[item.customProduct.productCode].fabric.imageUrl
                              : item.product?.imgURL
                          }
                          className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail wp-post-image"
                          alt="Product Image"
                        />
                      </td>
                      <td className="product-name">
                        {item.isCustom ? (
                          <div className="custom-details">
                            <p className="product-code">
                              {item.customProduct.productCode}
                            </p>
                            {details[item.customProduct.productCode] && (
                              <>
                                <p>
                                  Fabric: {details[item.customProduct.productCode].fabric.name}
                                </p>
                                <p>
                                  Lining: {details[item.customProduct.productCode].lining.name}
                                </p>
                                <div className="style-options">
                                  {details[item.customProduct.productCode].styleOptions.map((option, index) => (
                                    <p key={index}>
                                      {option.type}: {option.value}
                                    </p>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <p>{item.product.productCode}</p>
                        )}
                      </td>
                      <td className="product-price">${item.price}</td>
                      <td className="product-quantity">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn decrease"
                            onClick={() =>
                              handleQuantityChange(
                                item.customProduct
                                  ? item.customProduct.productCode
                                  : item.product.productCode,
                                "decrease"
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="quantity-display">
                            {item.quantity}
                          </span>
                          <button
                            className="quantity-btn increase"
                            onClick={() =>
                              handleQuantityChange(
                                item.customProduct
                                  ? item.customProduct.productCode
                                  : item.product.productCode,
                                "increase"
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="product-subtotal">
                        ${item.price * item.quantity}
                      </td>
                      <td className="product-note">
                        {item.note}
                      </td>
                      <td className="product-remove">
                        <button
                          className="remove-button"
                          onClick={() =>
                            removeFromCart(
                              item.customProduct
                                ? item.customProduct.productCode
                                : item.product.productCode
                            )
                          }
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="cart-total">
                <p>
                  <strong>Total Price:</strong> {apiCart.cartTotal} USD.
                </p>
              </div>
              {/* <div className="measurement-notice" style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '15px',
              margin: '20px 0',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p>
                <strong>Note:</strong> For the service fee, we will charge you 10$.
              </p>
            </div> */}
              <div>
                <button className="checkout-button">
                  <Link to="/checkout">Proceed to checkout</Link>
                </button>
              </div>
            </div>
          ) : (
            <>
              <p>Your cart is empty.</p>
              <button className="return-home-button">
                <Link to="/">Continue Shopping</Link>
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
