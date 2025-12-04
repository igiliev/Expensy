import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const switchTab = (tab) => {
    setIsLogin(tab === 'login');
  };

  return (
    <div className="auth-page">
      {/* Background Decoration */}
      <div className="background-decoration">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
      </div>

      {/* Auth Container */}
      <div className="auth-container">
        <div className="auth-box">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-subtitle">
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Sign up to start tracking your expenses'
              }
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="tab-buttons">
            <button
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
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
