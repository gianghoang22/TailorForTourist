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

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value === '' ? null : e.target.value
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      dob: '',
      phone: ''
    };

    // Validate name
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Validate date of birth
    const today = new Date();
    const dobDate = new Date(formData.dob);
    if (!formData.dob) {
      newErrors.dob = 'Please select a date of birth';
      isValid = false;
    } else if (dobDate > today) {
      newErrors.dob = 'Date of birth cannot be in the future';
      isValid = false;
    }

    // Validate phone
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!formData.phone) {
      newErrors.phone = 'Please enter a phone number';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('https://vesttour.xyz/api/User', formData);
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
            className={`input-field ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`input-field ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className={`input-field ${errors.dob ? 'error' : ''}`}
          />
          {errors.dob && <span className="error-message">{errors.dob}</span>}
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`input-field ${errors.password ? 'error' : ''}`}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
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

        <div className="form-group">
          <label className="label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`input-field ${errors.phone ? 'error' : ''}`}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <button type="submit" className="submit-button">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
