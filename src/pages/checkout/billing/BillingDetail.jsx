import React, { useState } from 'react';
import axios from 'axios';

const BillingDetail = () => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [deposit, setDeposit] = useState('');
  const [shippingFee, setShippingFee] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://157.245.50.125:8080/api/AddCart/confirmorder', {
        guestName,
        guestEmail,
        guestAddress,
        deposit,
        shippingFee
      });

      console.log('Response:', response.data);
      alert('Order confirmed successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to confirm order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="billing-detail-container">
      <h1>Billing Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guestName">Name</label>
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="guestEmail">Email</label>
          <input
            type="email"
            id="guestEmail"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="guestAddress">Address</label>
          <input
            type="text"
            id="guestAddress"
            value={guestAddress}
            onChange={(e) => setGuestAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deposit">Deposit</label>
          <input
            type="number"
            id="deposit"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="shippingFee">Shipping Fee</label>
          <input
            type="number"
            id="shippingFee"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default BillingDetail;
