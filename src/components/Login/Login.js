import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePassword}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <div className="error-message"></div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="checkbox-group">
        <div className="checkbox-wrapper">
          <input type="checkbox" id="rememberMe" className="checkbox-input" />
          <label htmlFor="rememberMe" className="checkbox-label">Remember me</label>
        </div>
        <a className="forgot-password" onClick={() => console.log('Password reset functionality would open here')}>
          Forgot password?
        </a>
      </div>

      {/* Sign In Button */}
      <button type="submit" className="btn-auth btn-primary-auth" disabled={authLoading}>
        {authLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      <div className="auth-footer">
        <span className="auth-footer-text">
          Don't have an account?
          <a className="auth-footer-link" onClick={onSwitchToRegister}>Sign up</a>
        </span>
      </div>
    </form>
  );
}

export default Login;
