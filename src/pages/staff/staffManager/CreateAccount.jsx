import React, { useState } from 'react';
import axios from 'axios';
import './CreateAccount.scss';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: 'male',
    status: 'active',
    isConfirmed: true,
    roleId: 3,
    phone: '0987654321'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7194/api/User', formData);
      setMessage('Account created successfully!');
      setError('');
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        dob: '',
        gender: 'male',
        status: 'active',
        isConfirmed: true,
        roleId: 3,
        phone: '0987654321'
      });

      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
      setMessage('');
    }
  };

  return (
    <div className="create-account">
      <h2>Create New Account</h2>
      
      {message && (
        <div className="success-message" style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          {message}
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          fontWeight: 'bold'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
