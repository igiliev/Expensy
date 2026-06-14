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
    <main className={styles.authPage}>
      {/* Background Decoration */}
      <div className={styles.backgroundDecoration} aria-hidden="true">
        <div className={`${styles.gradientBlob} ${styles.blob1}`}></div>
        <div className={`${styles.gradientBlob} ${styles.blob2}`}></div>
      </div>

      {/* Auth Container */}
      <section className={styles.authContainer} aria-labelledby="auth-title">
        <article className={styles.authBox}>
          {/* Header */}
          <header className={styles.authHeader}>
            <h1 id="auth-title" className={styles.authTitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className={styles.authSubtitle}>
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Sign up to start tracking your expenses'
              }
            </p>
          </header>

          {/* Tab Buttons */}
          <div className={styles.tabButtons} role="tablist" aria-label="Authentication form">
            <button
              className={`${styles.tabBtn} ${isLogin ? styles.active : ''}`}
              onClick={() => switchTab('login')}
              role="tab"
              aria-selected={isLogin}
            >
              Sign In
            </button>
            <button
              className={`${styles.tabBtn} ${!isLogin ? styles.active : ''}`}
              onClick={() => switchTab('register')}
              role="tab"
              aria-selected={!isLogin}
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
        </article>
      </section>
    </main>
  );
}

export default Auth;
