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
    phone: ''
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
        phone: ''
      });

      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
      setMessage('');
    }
  };

  return (
    <div className="create-account-container">
      <h2 className="title">Create New Account</h2>
      
      {message && (
        <div className="notification success">
          {message}
        </div>
      )}
      
      {error && (
        <div className="notification error">
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-group">
          <label className="label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input-field"
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
