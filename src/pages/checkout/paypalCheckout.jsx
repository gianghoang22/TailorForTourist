import React, { useEffect } from 'react';

const PayPalCheckoutButton = ({ totalPrice, onSuccess, onError }) => {
  useEffect(() => {
    if (!document.getElementById('paypal-script')) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AdsYCtJXJ7FC2O9-sB4OtYURnik9DBHH_Dfd-OlsxmJcc9OinV3dj1TnWAzI2XB4-tMfoUbToOCJWZZt&currency=USD`;
      script.id = 'paypal-script';
      script.addEventListener('load', () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalPrice, // Use the totalPrice prop here
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details); // Handle success
            });
          },
          onError: (err) => {
            console.error('PayPal Checkout Error:', err);
            onError && onError(err); // Handle error
          },
        }).render('#paypal-button-container');
      });
      document.body.appendChild(script);
    }

    return () => {
      const scriptElement = document.getElementById('paypal-script');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [totalPrice, onSuccess, onError]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalCheckoutButton;
