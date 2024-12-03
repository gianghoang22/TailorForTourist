import React, { useEffect, useState } from "react";

const PayPalCheckoutButton = ({
  amount,
  shippingFee = 0,
  onSuccess,
  onError,
  selectedVoucher = null,
}) => {
  const [isDeposit, setIsDeposit] = useState(false);
  const validAmount = parseFloat(amount) || 0;
  const validShippingFee = parseFloat(shippingFee) || 0;

  // Tính toán giảm giá dựa trên loại voucher
  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;

    if (selectedVoucher.voucherCode.substring(0, 8) === "FREESHIP") {
      // Voucher free ship
      return validShippingFee * selectedVoucher.discountNumber;
    } else if (selectedVoucher.voucherCode.substring(0, 7) === "BIGSALE") {
      // Voucher giảm giá sản phẩm
      return validAmount * selectedVoucher.discountNumber;
    }
    return 0;
  };

  const discount = calculateDiscount();
  // Tính subtotal sau khi áp dụng giảm giá
  const discountedAmount =
    selectedVoucher?.voucherCode.substring(0, 7) === "BIGSALE"
      ? validAmount - discount
      : validAmount;

  // Tính shipping fee sau khi áp dụng giảm giá
  const finalShippingFee =
    selectedVoucher?.voucherCode.substring(0, 8) === "FREESHIP"
      ? validShippingFee - discount
      : validShippingFee;

  // Tổng cộng cuối cùng
  const subtotal = discountedAmount + finalShippingFee;
  const finalPrice = isDeposit ? subtotal * 0.5 : subtotal;

  useEffect(() => {
    const renderPayPalButton = () => {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              if (validAmount <= 0) {
                throw new Error("Invalid price amount");
              }

              const payableItemTotal = isDeposit
                ? discountedAmount * 0.5
                : discountedAmount;
              const payableShipping = isDeposit
                ? finalShippingFee * 0.5
                : finalShippingFee;

              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: finalPrice.toFixed(2),
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: payableItemTotal.toFixed(2),
                        },
                        shipping: {
                          currency_code: "USD",
                          value: payableShipping.toFixed(2),
                        },
                      },
                    },
                    description: `${isDeposit ? "50% Deposit" : "Full"} Payment${selectedVoucher ? ` (Voucher: ${selectedVoucher.voucherCode})` : ""}`,
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                onSuccess({
                  ...details,
                  isDeposit,
                  depositAmount: isDeposit ? subtotal * 0.5 : 0,
                  appliedVoucher: selectedVoucher,
                  discount: discount,
                });
              });
            },
            onError: (err) => {
              console.error("PayPal Checkout Error:", err);
              onError?.(err);
            },
          })
          .render("#paypal-button-container");
      }
    };

    const initializePayPal = () => {
      if (!document.getElementById("paypal-script")) {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=AdsYCtJXJ7FC2O9-sB4OtYURnik9DBHH_Dfd-OlsxmJcc9OinV3dj1TnWAzI2XB4-tMfoUbToOCJWZZt&currency=USD`;
        script.id = "paypal-script";
        script.addEventListener("load", () => {
          renderPayPalButton();
        });
        document.body.appendChild(script);
      } else {
        renderPayPalButton();
      }
    };

    initializePayPal();

    return () => {
      const scriptElement = document.getElementById("paypal-script");
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [
    finalPrice,
    onSuccess,
    onError,
    isDeposit,
    validAmount,
    validShippingFee,
    subtotal,
    selectedVoucher,
    discount,
  ]);

  return (
    <div className="paypal-container">
      <div className="deposit-option">
        <label className="deposit-label">
          <input
            type="checkbox"
            checked={isDeposit}
            onChange={(e) => setIsDeposit(e.target.checked)}
          />
          <span>Pay 50% Deposit (${(subtotal * 0.5).toFixed(2)})</span>
        </label>
        <p className="price-display">
          Original Price: ${validAmount.toFixed(2)}
          {discount > 0 &&
            selectedVoucher?.voucherCode.substring(0, 7) === "BIGSALE" && (
              <>
                <br />
                <span className="discount">
                  Discount ({selectedVoucher.discountNumber * 100}%): -$
                  {discount.toFixed(2)}
                </span>
                <br />
                <span>Discounted Price: ${discountedAmount.toFixed(2)}</span>
              </>
            )}
          {validShippingFee > 0 && (
            <>
              <br />
              <span>Shipping Fee: ${validShippingFee.toFixed(2)}</span>
              {selectedVoucher?.voucherCode.substring(0, 8) === "FREESHIP" && (
                <>
                  <br />
                  <span className="discount">
                    Shipping Discount: -${discount.toFixed(2)}
                  </span>
                </>
              )}
            </>
          )}
          <br />
          <strong>Total to pay: ${finalPrice.toFixed(2)}</strong>
          {isDeposit && (
            <>
              <br />
              <span className="deposit-note">
                (50% deposit of total ${subtotal.toFixed(2)})
              </span>
            </>
          )}
          {selectedVoucher && (
            <>
              <br />
              <span className="voucher-applied">
                Voucher applied: {selectedVoucher.voucherCode}
              </span>
            </>
          )}
        </p>
      </div>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default PayPalCheckoutButton;
