import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useExpense } from '../../contexts/ExpenseContext';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import logo from '../../images/expensy-logo.svg';
import styles from './Header.module.scss';

function Header({ onAddTransaction }) {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { resetCurrentMonth } = useExpense();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handleResetMonth = () => {
    setIsResetModalOpen(true);
  };

  const confirmResetMonth = () => {
    resetCurrentMonth();
    setIsResetModalOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <img src={logo} alt="Expensy AI" className={styles.navLogo} />
        </div>
        <div className={styles.navActions}>
          {user && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                History
              </NavLink>
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
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset month?"
        message="Your dashboard totals and recent transactions will start fresh from this moment. Previous transactions stay saved for future history."
        confirmLabel="Reset month"
        cancelLabel="Keep current data"
        onConfirm={confirmResetMonth}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </>
  );
}

export default Header;
