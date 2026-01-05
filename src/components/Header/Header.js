import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../images/expensy-logo.png';
import styles from './Header.module.scss';

function Header({ onAddTransaction }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>
        <img src={logo} alt="Expensy AI" className={styles.navLogo} />
      </div>
      <div className={styles.navActions}>
        {user && (
          <>
            <button
              onClick={onAddTransaction}
              className={styles.transactionButton}
              title="Add Transaction"
            >
              + Add Transaction
            </button>
            <span className="text-sm text-gray-200 hidden sm:block">
              Welcome, {user.email}
            </span>
            <button
              onClick={handleLogout}
              className={styles.navIcon}
              title="Logout"
            >
              ⏻
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
