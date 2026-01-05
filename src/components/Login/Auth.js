import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import styles from './Auth.module.scss';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const switchTab = (tab) => {
    setIsLogin(tab === 'login');
  };

  return (
    <div className={styles.authPage}>
      {/* Background Decoration */}
      <div className={styles.backgroundDecoration}>
        <div className={`${styles.gradientBlob} ${styles.blob1}`}></div>
        <div className={`${styles.gradientBlob} ${styles.blob2}`}></div>
      </div>

      {/* Auth Container */}
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className={styles.authSubtitle}>
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Sign up to start tracking your expenses'
              }
            </p>
          </div>

          {/* Tab Buttons */}
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabBtn} ${isLogin ? styles.active : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              className={`${styles.tabBtn} ${!isLogin ? styles.active : ''}`}
              onClick={() => switchTab('register')}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <Login onSwitchToRegister={() => switchTab('register')} />
          ) : (
            <Register onSwitchToLogin={() => switchTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
