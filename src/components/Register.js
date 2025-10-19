import React, { useState } from 'react';
import { register } from '../services/api';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register for Smart Parking</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Registration successful! Redirecting to login...</div>}
        
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
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
            placeholder="Enter your email"
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
            minLength="6"
            placeholder="Enter password (min 6 characters)"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>Vehicle Number</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
            placeholder="Enter your vehicle number"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="auth-switch">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin}>
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;