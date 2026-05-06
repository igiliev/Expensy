import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../images/expensy-logo.png';
import styles from './Header.module.scss';

function Header({ onAddTransaction }) {
  const { user, logout } = useAuth();
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mobileQuery = window.matchMedia('(max-width: 640px)');

    const handleViewportChange = () => {
      if (!mobileQuery.matches) {
        setIsMobileCollapsed(false);
      }
    };

    const handleScroll = () => {
      if (!mobileQuery.matches) {
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsMobileCollapsed(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollYRef.current) {
        setIsMobileCollapsed(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', handleViewportChange);
    } else {
      mobileQuery.addListener(handleViewportChange);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', handleViewportChange);
      } else {
        mobileQuery.removeListener(handleViewportChange);
      }
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className={`${styles.navbar} ${isMobileCollapsed ? styles.mobileCollapsed : ''}`}>
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
