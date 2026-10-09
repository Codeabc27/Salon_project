import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('owner_token'));

  const handleLogout = () => {
    localStorage.removeItem('owner_token');
    setToken(null);
  };

  if (!token) {
    return <AuthPage onLoginSuccess={() => setToken(localStorage.getItem('owner_token'))} />;
  }

  return <DashboardPage onLogout={handleLogout} />;
}