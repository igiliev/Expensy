import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useExpense } from '../../contexts/ExpenseContext';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import logo from '../../images/expensy-logo.svg';
import styles from './Header.module.scss';

function Header({ onAddTransaction }) {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { resetCurrentMonth } = useExpense();

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleResetMonth = () => {
    setIsMobileMenuOpen(false);
    setIsResetModalOpen(true);
  };

  const handleAddTransaction = () => {
    setIsMobileMenuOpen(false);
    onAddTransaction();
  };

  const confirmResetMonth = () => {
    resetCurrentMonth();
    setIsResetModalOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <img src={logo} alt="Expensy AI" className={styles.navLogo} />
        </div>
        {user && (
          <button
            onClick={handleAddTransaction}
            className={styles.mobileAddButton}
            title="Add Transaction"
          >
            + Add
          </button>
        )}
        {user && (
          <button
            type="button"
            className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.mobileMenuToggleOpen : ''}`}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
          >
            <span className={styles.menuIcon} aria-hidden="true">
              <span className={`${styles.menuLine} ${styles.menuLineTop}`} />
              <span className={`${styles.menuLine} ${styles.menuLineMiddle}`} />
              <span className={`${styles.menuLine} ${styles.menuLineBottom}`} />
            </span>
          </button>
        )}
        <div
          id="primary-navigation"
          className={`${styles.navActions} ${isMobileMenuOpen ? styles.navActionsOpen : ''}`}
        >
          {user && (
            <>
              <div className={styles.innerWrapper}>
                <NavLink
                  to="/"
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  History
                </NavLink>
              </div>

              <div className={styles.navRightWrapper}>
                <span className={styles.welcomeText}>
                  Welcome, {user.email}
                </span>
                <button
                  onClick={handleResetMonth}
                  className={styles.resetMonthButton}
                  title="Reset month"
                >
                  <span className={styles.desktopButtonLabel}>Reset month</span>
                  <span className={styles.mobileButtonLabel}>Reset</span>
                </button>
                <button
                  onClick={handleAddTransaction}
                  className={styles.transactionButton}
                  title="Add Transaction"
                >
                  <span className={styles.desktopButtonLabel}>+ Add Transaction</span>
                  <span className={styles.mobileButtonLabel}>+ Add</span>
                </button>
                <span className={styles.navDivider} aria-hidden="true" />
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  title="Logout"
                >
                  <svg
                    className={styles.logoutIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  Logout
                </button>
              </div>
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
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Log out?"
        message="You will need to sign in again to access your dashboard and transactions."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}

export default Header;
