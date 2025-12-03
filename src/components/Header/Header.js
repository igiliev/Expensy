import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../images/expensy-logo.png';

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="Expensy AI" className="nav-logo" />
      </div>
      <div className="nav-actions">
        <div className="nav-icon">🔔</div>
        <div className="nav-icon">⚙️</div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-200 hidden sm:block">
              Welcome, {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="nav-icon hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Logout"
            >
              🚪
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
