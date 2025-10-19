import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking, checkIn, checkOut } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bookings');
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        loadBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await checkIn(id);
      loadBookings();
      alert('Check-in successful!');
    } catch (err) {
      alert('Failed to check-in');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await checkOut(id);
      loadBookings();
      alert('Check-out successful!');
    } catch (err) {
      alert('Failed to check-out');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      
      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No bookings found. Book a parking spot to get started!
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>Spot {booking.parkingSpot?.spotNumber}</h3>
                <span className={`booking-status ${booking.status}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="booking-details">
                <div className="booking-detail">
                  <label>Vehicle Number</label>
                  <span>{booking.vehicleNumber}</span>
                </div>
                <div className="booking-detail">
                  <label>Location</label>
                  <span>Floor {booking.parkingSpot?.floor}, Zone {booking.parkingSpot?.zone}</span>
                </div>
                <div className="booking-detail">
                  <label>Start Time</label>
                  <span>{formatDate(booking.startTime)}</span>
                </div>
                <div className="booking-detail">
                  <label>End Time</label>
                  <span>{formatDate(booking.endTime)}</span>
                </div>
                <div className="booking-detail">
                  <label>Duration</label>
                  <span>{booking.duration} hours</span>
                </div>
                <div className="booking-detail">
                  <label>Total Price</label>
                  <span>₹{booking.totalPrice}</span>
                </div>
              </div>

              <div className="booking-actions">
                {booking.status === 'active' && !booking.checkIn && (
                  <>
                    <button className="btn btn-success" onClick={() => handleCheckIn(booking._id)}>
                      Check In
                    </button>
                    <button className="btn btn-danger" onClick={() => handleCancel(booking._id)}>
                      Cancel Booking
                    </button>
                  </>
                )}
                
                {booking.checkIn && !booking.checkOut && (
                  <button className="btn btn-warning" onClick={() => handleCheckOut(booking._id)}>
                    Check Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;