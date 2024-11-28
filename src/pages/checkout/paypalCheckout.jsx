import React, { useEffect, useState } from 'react';

const PayPalCheckoutButton = ({ amount, shippingFee = 0, onSuccess, onError }) => {
  const [isDeposit, setIsDeposit] = useState(false);
  const validAmount = parseFloat(amount) || 0;
  const validShippingFee = parseFloat(shippingFee) || 0;
  const subtotal = validAmount + validShippingFee;
  const finalPrice = isDeposit ? subtotal * 0.5 : subtotal;

  useEffect(() => {
    const initializePayPal = () => {
      if (!document.getElementById('paypal-script')) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AdsYCtJXJ7FC2O9-sB4OtYURnik9DBHH_Dfd-OlsxmJcc9OinV3dj1TnWAzI2XB4-tMfoUbToOCJWZZt&currency=USD`;
        script.id = 'paypal-script';
        script.addEventListener('load', () => {
          renderPayPalButton();
        });
        document.body.appendChild(script);
      } else {
        renderPayPalButton();
      }
    };

    const renderPayPalButton = () => {
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Clear existing button
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            if (validAmount <= 0) {
              throw new Error('Invalid price amount');
            }

            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: finalPrice.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess({ ...details, isDeposit });
            });
          },
          onError: (err) => {
            console.error('PayPal Checkout Error:', err);
            onError?.(err);
          },
        }).render('#paypal-button-container');
      }
    };

    initializePayPal();

    return () => {
      const scriptElement = document.getElementById('paypal-script');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [finalPrice, onSuccess, onError, isDeposit, validAmount]);

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
          Subtotal: ${validAmount.toFixed(2)}
          {validShippingFee > 0 && <><br />Shipping Fee: ${validShippingFee.toFixed(2)}</>}
          <br />
          Total to pay: ${finalPrice.toFixed(2)}
          {isDeposit && ` (50% of $${subtotal.toFixed(2)})`}
        </p>
      </div>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default PayPalCheckoutButton;