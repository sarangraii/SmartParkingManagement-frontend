import React, { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking, checkIn, checkOut } from '../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await getAllBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bookings');
      setLoading(false);
      console.error('Error loading bookings:', err);
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>All Bookings (Admin View)</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            Active ({bookings.filter(b => b.status === 'active').length})
          </button>
          <button 
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
          <button 
            className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No bookings found.
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>Spot {booking.parkingSpot?.spotNumber}</h3>
                <span className={`booking-status ${booking.status}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              {/* User Information */}
              <div className="booking-user-info" style={{ 
                background: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '5px', 
                marginBottom: '15px' 
              }}>
                <strong>User Details:</strong>
                <div style={{ marginTop: '5px', fontSize: '14px' }}>
                  <div>👤 {booking.user?.name}</div>
                  <div>📧 {booking.user?.email}</div>
                  <div>📱 {booking.user?.phone}</div>
                </div>
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
                {booking.checkIn && (
                  <div className="booking-detail">
                    <label>Check-In Time</label>
                    <span>{formatDate(booking.checkIn)}</span>
                  </div>
                )}
                {booking.checkOut && (
                  <div className="booking-detail">
                    <label>Check-Out Time</label>
                    <span>{formatDate(booking.checkOut)}</span>
                  </div>
                )}
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

export default AdminBookings;