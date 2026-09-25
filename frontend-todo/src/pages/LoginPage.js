import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearAuthError();

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      // Error message is stored in authError and handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" id="login-card">
        <div className="auth-header">
          <div className="auth-icon-badge">🔐</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your tasks securely</p>
        </div>

        <ErrorMessage
          message={formError || authError}
          onDismiss={() => {
            setFormError('');
            clearAuthError();
          }}
        />

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label htmlFor="login-email-input" className="form-label">
              Email Address
            </label>
            <input
              id="login-email-input"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password-input" className="form-label">
              Password
            </label>
            <input
              id="login-password-input"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            id="login-submit-button"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loading-inline">
                <span className="spinner-sm"></span> Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link" id="go-to-register-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
