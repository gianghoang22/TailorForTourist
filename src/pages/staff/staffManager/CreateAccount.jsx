import React, { useState } from 'react';
import axios from 'axios';
import './CreateAccount.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
      isValid = false;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
      } else if (formData.email.length > 100) {
        newErrors.email = 'Email must not exceed 100 characters';
        isValid = false;
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (formData.password.length > 50) {
      newErrors.password = 'Password must not exceed 50 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }

    // Validate date of birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      isValid = false;
    } else {
      const today = new Date();
      const dobDate = new Date(formData.dob);
      const age = today.getFullYear() - dobDate.getFullYear();
      
      if (dobDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
        isValid = false;
      } else if (age < 16) {
        newErrors.dob = 'Must be at least 16 years old';
        isValid = false;
      } else if (age > 100) {
        newErrors.dob = 'Invalid date of birth';
        isValid = false;
      }
    }

    // Validate phone
    if (formData.phone) {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Invalid Vietnamese phone number format';
        isValid = false;
      }
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
      toast.success('Account created successfully!');
      
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
      toast.error(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="create-account-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <h2 className="title">Create New Account</h2>
      
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
