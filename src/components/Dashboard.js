import React, { useState, useEffect, useContext } from 'react';
import { getAllSpots } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ParkingGrid from './ParkingGrid';
import MyBookings from './MyBookings';
import AdminBookings from './AdminBookings';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
  });
  const [activeTab, setActiveTab] = useState('parking');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getAllSpots();
      const spots = response.data;
      
      setStats({
        total: spots.length,
        available: spots.filter(s => s.status === 'available').length,
        occupied: spots.filter(s => s.status === 'occupied').length,
        reserved: spots.filter(s => s.status === 'reserved').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h2>Parking Dashboard</h2>
          
          <div className="stats">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Spots</p>
            </div>
            <div className="stat-card">
              <h3>{stats.available}</h3>
              <p>Available</p>
            </div>
            <div className="stat-card">
              <h3>{stats.occupied}</h3>
              <p>Occupied</p>
            </div>
            <div className="stat-card">
              <h3>{stats.reserved}</h3>
              <p>Reserved</p>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${activeTab === 'parking' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('parking')}
            >
              Parking Spots
            </button>
            <button 
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('bookings')}
            >
              {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
            </button>
          </div>
        </div>

        {activeTab === 'parking' ? (
          <ParkingGrid />
        ) : (
          user?.role === 'admin' ? <AdminBookings /> : <MyBookings />
        )}
      </div>
    </div>
  );
};

export default Dashboard;