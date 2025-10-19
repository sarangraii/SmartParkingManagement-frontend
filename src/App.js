import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="app">
      <Navbar />
      <Dashboard />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;