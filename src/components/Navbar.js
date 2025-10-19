import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>🚗 Smart Parking</h1>
        <div className="navbar-menu">
          <span>Welcome, {user?.name}</span>
          {user?.role === 'admin' && <span style={{ color: '#667eea' }}>(Admin)</span>}
          <button onClick={logoutUser}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;