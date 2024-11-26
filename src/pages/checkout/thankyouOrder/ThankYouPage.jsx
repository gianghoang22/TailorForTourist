import React from 'react';
import './ThankYouPage.scss';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="thank-you-container">
      <div className="thank-you-message">
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been successfully placed. You will receive a confirmation email shortly.</p>
        <p>We appreciate your business and look forward to serving you again.</p>
        <Link to='/' className="back-home-button">Back to Homepage</Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
