import React, { useState } from 'react';
import axios from 'axios';

const ConfirmOrderForm = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestAddress: '',
    deposit: '',
    shippingFee: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseMessage('');

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    if (!token) {
      setError('Bạn chưa đăng nhập');
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:7194/api/AddCart/confirmorder',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setResponseMessage('Đơn hàng đã được xác nhận thành công!');
        setFormData({
          guestName: '',
          guestEmail: '',
          guestAddress: '',
          deposit: '',
          shippingFee: '',
        });
      } else {
        setError('Không thể xác nhận đơn hàng.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi yêu cầu.');
    }
  };

  return (
    <div>
      <h2>Xác nhận Đơn Hàng</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ và Tên:</label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="guestEmail"
            value={formData.guestEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Địa Chỉ:</label>
          <input
            type="text"
            name="guestAddress"
            value={formData.guestAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Tiền Cọc:</label>
          <input
            type="number"
            name="deposit"
            value={formData.deposit}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phí Vận Chuyển:</label>
          <input
            type="number"
            name="shippingFee"
            value={formData.shippingFee}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Xác Nhận</button>
      </form>
    </div>
  );
};

export default ConfirmOrderForm;
