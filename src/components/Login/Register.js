import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, error } = useAuth();

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

    setLoading(true);

    try {
      const result = await register(formData.email, formData.password);
      if (!result.success) {
        // Error is handled by AuthContext
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;
  const passwordTooShort = formData.password && formData.password.length < 6;

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="error-message"></div>
      </div>

      {/* Password Input */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="password-input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="form-input password-input"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <div className="error-message"></div>
        {passwordTooShort && (
          <div className="error-message show">
            Password must be at least 6 characters long
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <div className="password-input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            className="form-input password-input"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <div className="error-message"></div>
        {passwordMismatch && (
          <div className="error-message show">
            Passwords do not match
          </div>
        )}
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        className="btn-auth btn-primary-auth"
        disabled={loading || passwordMismatch || passwordTooShort}
      >
        {loading ? (
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
      <div className="auth-footer">
        <span className="auth-footer-text">
          Already have an account?
          <a className="auth-footer-link" onClick={onSwitchToLogin}>Sign in</a>
        </span>
      </div>
    </form>
  );
}

export default Register;
