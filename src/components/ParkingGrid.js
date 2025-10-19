import React, { useState, useEffect } from 'react';
import { getAllSpots } from '../services/api';
import BookingForm from './BookingForm';

const ParkingGrid = () => {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    floor: '',
    zone: '',
    type: '',
  });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadSpots();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, spots]);

  const loadSpots = async () => {
    try {
      const response = await getAllSpots();
      setSpots(response.data);
      setFilteredSpots(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading spots:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = spots;

    if (filters.status) {
      filtered = filtered.filter(spot => spot.status === filters.status);
    }
    if (filters.floor) {
      filtered = filtered.filter(spot => spot.floor === parseInt(filters.floor));
    }
    if (filters.zone) {
      filtered = filtered.filter(spot => spot.zone === filters.zone);
    }
    if (filters.type) {
      filtered = filtered.filter(spot => spot.type === filters.type);
    }

    setFilteredSpots(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSpotClick = (spot) => {
    if (spot.status === 'available') {
      setSelectedSpot(spot);
      setShowBookingForm(true);
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedSpot(null);
    loadSpots();
  };

  if (loading) {
    return <div className="loading">Loading parking spots...</div>;
  }

  return (
    <div className="parking-grid-container">
      <h2>Available Parking Spots</h2>
      
      <div className="filters">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <select name="floor" value={filters.floor} onChange={handleFilterChange}>
          <option value="">All Floors</option>
          <option value="1">Floor 1</option>
          <option value="2">Floor 2</option>
          <option value="3">Floor 3</option>
        </select>

        <select name="zone" value={filters.zone} onChange={handleFilterChange}>
          <option value="">All Zones</option>
          <option value="A">Zone A</option>
          <option value="B">Zone B</option>
          <option value="C">Zone C</option>
          <option value="D">Zone D</option>
        </select>

        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="regular">Regular</option>
          <option value="compact">Compact</option>
          <option value="large">Large</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <div className="parking-grid">
        {filteredSpots.map((spot) => (
          <div
            key={spot._id}
            className={`parking-spot ${spot.status}`}
            onClick={() => handleSpotClick(spot)}
          >
            <div className="spot-number">{spot.spotNumber}</div>
            <div className="spot-info">Floor {spot.floor} | Zone {spot.zone}</div>
            <div className="spot-info">{spot.type}</div>
            <div className="spot-price">₹{spot.pricePerHour}/hr</div>
            <div className="spot-info" style={{ marginTop: '5px', fontWeight: 'bold' }}>
              {spot.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {filteredSpots.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No parking spots found with the selected filters.
        </div>
      )}

      {showBookingForm && (
        <BookingForm
          spot={selectedSpot}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default ParkingGrid;