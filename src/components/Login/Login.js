import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.scss';

function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, authLoading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        // Error is handled by AuthContext
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email Address</label>
        <input
          type="email"
          name="email"
          className={styles.formInput}
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className={styles.errorMessage}></div>
      </div>

      {/* Password Input */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Password</label>
        <div className={styles.passwordInputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className={`${styles.formInput} ${styles.passwordInput}`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={togglePassword}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <div className={styles.errorMessage}></div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className={styles.checkboxGroup}>
        <div className={styles.checkboxWrapper}>
          <input type="checkbox" id="rememberMe" className={styles.checkboxInput} />
          <label htmlFor="rememberMe" className={styles.checkboxLabel}>Remember me</label>
        </div>
        <a className={styles.forgotPassword} onClick={() => console.log('Password reset functionality would open here')}>
          Forgot password?
        </a>
      </div>

      {/* Sign In Button */}
      <button type="submit" className={`${styles.btnAuth} ${styles.btnPrimaryAuth}`} disabled={authLoading}>
        { authLoading ? (
          <>
            <svg className={styles.animateSpin } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Footer */}
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>
          Don't have an account?
          <a className={styles.authFooterLink} onClick={onSwitchToRegister}>Sign up</a>
        </span>
      </div>
    </form>
  );
}

export default Login;
