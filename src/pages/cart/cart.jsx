import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.scss";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "../../layouts/components/navigation/Navigation.jsx";
import { Footer } from "../../layouts/components/footer/Footer.jsx";

const Cart = () => {
  const [apiCart, setApiCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://localhost:7194/api/AddCart/mycart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const cartItems = response.data.cartItems;

          // Lưu productCode vào localStorage
          const productCode = cartItems.map(
            (item) =>
              item.product?.productCode || item.customProduct?.productCode
          );
          localStorage.setItem("productCode", JSON.stringify(productCode));

          setApiCart(response.data);
        } else {
          setError("Không thể tải giỏ hàng");
        }
      } catch (error) {
        setError("Đã xảy ra lỗi khi lấy giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (productCodeToRemove) => {
    const userId = parseInt(localStorage.getItem("userID"));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập");
        return;
      }

      const response = await axios.delete(
        "https://localhost:7194/api/AddCart/remove/${productCode}",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            productCode: productCodeToRemove,
            userId: userId || null,
          },
        }
      );

      if (response.status === 200) {
        const removedItem = apiCart.cartItems.find(
          (item) =>
            (item.product?.productCode || item.customProduct?.productCode) ===
            productCodeToRemove
        );

        if (removedItem) {
          const updatedCartItems = apiCart.cartItems.filter(
            (item) =>
              (item.product?.productCode || item.customProduct?.productCode) !==
              productCodeToRemove
          );

          const updatedCartTotal =
            apiCart.cartTotal - removedItem.price * removedItem.quantity;

          setApiCart({
            ...apiCart,
            cartItems: updatedCartItems,
            cartTotal: updatedCartTotal,
          });

          const updatedProductCodes = JSON.parse(
            localStorage.getItem("productCode") || "[]"
          );
          const newProductCodes = updatedProductCodes.filter(
            (code) => code !== productCodeToRemove
          );
          localStorage.setItem("productCode", JSON.stringify(newProductCodes));
        }
      } else {
        setError("Không thể xóa sản phẩm khỏi giỏ hàng");
      }
    } catch (error) {
      console.error(
        "Error removing from cart:",
        error.response?.data || error.message
      );
      setError("Đã xảy ra lỗi khi xóa sản phẩm");
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: "120px" }} className="page-with-side-bar">
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
            <div>
              <ul>
                {apiCart.cartItems.map((item) => (
                  <li key={item.cartItemId} className="cart-item">
                    <div className="custom-product-details">
                      {item.customProduct ? (
                        <>
                          <p>
                            <strong>Product:</strong>{" "}
                            {item.customProduct.productCode}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Product:</strong> {item.product.productCode}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                        </>
                      )}
                      <p>
                        <strong>Price:</strong> ${item.price}
                      </p>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(
                          item.product?.productCode ||
                            item.customProduct?.productCode
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <p>
                  <strong>Total Price:</strong> ${apiCart.cartTotal}
                </p>
              </div>
              <div>
                <Link to="/checkout">Proceed to checkout</Link>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
