import React, { useEffect, useState } from "react";
import axios from "axios";

const PayPalCheckoutButton = ({
  amount,
  shippingFee = 0,
  onSuccess,
  onError,
  selectedVoucher = null,
  deliveryMethod
}) => {
  const [isDeposit, setIsDeposit] = useState(false);

  const validAmount = parseFloat(amount) || 0;
  const validShippingFee = parseFloat(shippingFee) || 0;

  const finalPrice = validAmount + validShippingFee;

  useEffect(() => {
    const renderPayPalButton = () => {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              console.log("Final Price:", finalPrice);

              if (validAmount <= 0) {
                throw new Error("Invalid price amount");
              }

              const itemTotal = isDeposit
                ? validAmount * 0.5
                : validAmount; // 50% for deposit, full otherwise
              const shippingValue = validShippingFee;

              const calculatedTotal = itemTotal + shippingValue;

              // Ensure total matches the breakdown
              if (calculatedTotal.toFixed(2) !== finalPrice.toFixed(2)) {
                throw new Error(
                  `AMOUNT_MISMATCH: Total ${calculatedTotal.toFixed(
                    2
                  )} does not match Final Price ${finalPrice.toFixed(2)}`
                );
              }

              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: finalPrice.toFixed(2),
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: itemTotal.toFixed(2),
                        },
                        shipping: {
                          currency_code: "USD",
                          value: shippingValue.toFixed(2),
                        },
                      },
                    },
                    description: `${
                      isDeposit ? "50% Deposit" : "Full"
                    } Payment${
                      selectedVoucher
                        ? ` (Voucher: ${selectedVoucher.voucherCode})`
                        : ""
                    }`,
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();
              onSuccess({
                ...details,
                isDeposit,
                depositAmount: isDeposit ? validAmount * 0.5 : 0,
                totalAmount: finalPrice,
                appliedVoucher: selectedVoucher,
                confirmOrder: true,
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
  }, [finalPrice, onSuccess, onError, isDeposit, validAmount, validShippingFee]);

  return (
    <div className="paypal-container">
      <div className="deposit-option">
        
        <p className="price-display">
          Original Price: ${validAmount.toFixed(2)}
          {validShippingFee > 0 && (
            <>
              <br />
              <span>Shipping Fee: ${validShippingFee.toFixed(2)}</span>
            </>
          )}
          <br />
          <strong>Total to pay: ${finalPrice.toFixed(2)}</strong>
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