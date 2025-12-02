import React from 'react';
import logo from '../../images/expensy-logo.png';

function Header() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="Expensy AI" className="nav-logo" />
      </div>
      <div className="nav-actions">
        <div className="nav-icon">🔔</div>
        <div className="nav-icon">⚙️</div>
      </div>
    </nav>
  );
}

export default Header;
