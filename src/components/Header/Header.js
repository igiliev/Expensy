import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExpense } from '../../contexts/ExpenseContext';
import logo from '../../images/expensy-logo.svg';
import styles from './Header.module.scss';

function Header({ onAddTransaction }) {
  const { user, logout } = useAuth();
  const { resetCurrentMonth } = useExpense();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handleResetMonth = () => {
    if (window.confirm('Reset this month? Your previous transactions will be hidden from the dashboard, but kept for history.')) {
      resetCurrentMonth();
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
              onClick={handleResetMonth}
              className={styles.resetMonthButton}
              title="Reset month"
            >
              <span className={styles.desktopButtonLabel}>Reset month</span>
              <span className={styles.mobileButtonLabel}>Reset</span>
            </button>
            <button
              onClick={onAddTransaction}
              className={styles.transactionButton}
              title="Add Transaction"
            >
              <span className={styles.desktopButtonLabel}>+ Add Transaction</span>
              <span className={styles.mobileButtonLabel}>+ Add</span>
            </button>
            <span className={styles.welcomeText}>
              Welcome, {user.email}
            </span>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
