import React, { useState, useContext } from 'react';
import { createBooking } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const BookingForm = ({ spot, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    vehicleNumber: user?.vehicleNumber || '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePrice = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      return hours > 0 ? hours * spot.pricePerHour : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createBooking({
        parkingSpotId: spot._id,
        ...formData,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal">
      <div className="booking-form-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Book Parking Spot</h3>
        
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <p><strong>Spot:</strong> {spot.spotNumber}</p>
          <p><strong>Location:</strong> Floor {spot.floor}, Zone {spot.zone}</p>
          <p><strong>Type:</strong> {spot.type}</p>
          <p><strong>Rate:</strong> ₹{spot.pricePerHour}/hour</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              placeholder="Enter vehicle number"
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              min={formData.startTime}
            />
          </div>

          {calculatePrice() > 0 && (
            <div style={{ background: '#d4edda', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
              <strong>Estimated Price: ₹{calculatePrice()}</strong>
            </div>
          )}

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;