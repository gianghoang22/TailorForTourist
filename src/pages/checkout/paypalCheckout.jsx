import React, { useEffect } from 'react';

const PayPalCheckoutButton = ({ cartItems = [], onSuccess, onError, totalPrice }) => {
  useEffect(() => {
    // Only add the PayPal script once
    if (!document.getElementById('paypal-script')) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AdsYCtJXJ7FC2O9-sB4OtYURnik9DBHH_Dfd-OlsxmJcc9OinV3dj1TnWAzI2XB4-tMfoUbToOCJWZZt&currency=USD`;
      script.id = 'paypal-script';
      script.addEventListener('load', () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            // Use totalPrice for the order amount
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice, // Use totalPrice prop here
                },
              }],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              onSuccess(details); // Handle successful payment
            });
          },
          onError: (err) => {
            console.error("Payment error:", err);
            onError && onError(err); // Handle payment error
          },
        }).render('#paypal-button-container');
      });
      document.body.appendChild(script);
    }

    return () => {
      // Clean up script when component unmounts
      const scriptElement = document.getElementById('paypal-script');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [cartItems, onSuccess, onError, totalPrice]); // Add totalPrice as a dependency

  return <div id="paypal-button-container"></div>;
};

export default PayPalCheckoutButton;