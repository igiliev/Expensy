import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.scss';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, authLoading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    try {
      const result = await register(formData.email, formData.password);
      if (!result.success) {
        // Error is handled by AuthContext
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;
  const passwordTooShort = formData.password && formData.password.length < 6;

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="register-email">Email Address</label>
        <input
          id="register-email"
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
        <label className={styles.formLabel} htmlFor="register-password">Password</label>
        <div className={styles.passwordInputGroup}>
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className={`${styles.formInput} ${styles.passwordInput}`}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <div className={styles.errorMessage}></div>
        {passwordTooShort && (
          <div className={`${styles.errorMessage} ${styles.show}`}>
            Password must be at least 6 characters long
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="register-confirm-password">Confirm Password</label>
        <div className={styles.passwordInputGroup}>
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            className={`${styles.formInput} ${styles.passwordInput}`}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <div className={styles.errorMessage}></div>
        {passwordMismatch && (
          <div className={`${styles.errorMessage} ${styles.show}`}>
            Passwords do not match
          </div>
        )}
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        className={`${styles.btnAuth} ${styles.btnPrimaryAuth}`}
        disabled={authLoading || passwordMismatch || passwordTooShort}
      >
        {authLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Footer */}
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>
          Already have an account?
          <button type="button" className={styles.authFooterLink} onClick={onSwitchToLogin}>Sign in</button>
        </span>
      </div>
    </form>
  );
}

export default Register;
