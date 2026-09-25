import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearAuthError();

    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter a name with at least 2 characters.');
      return;
    }

    if (!email.trim()) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await register(name.trim(), email.trim(), password);
      navigate('/todos', { replace: true });
    } catch {
      // Error is caught and stored in authError
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" id="register-card">
        <div className="auth-header">
          <div className="auth-icon-badge">✨</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join TodoStack to organize your daily productivity</p>
        </div>

        <ErrorMessage
          message={formError || authError}
          onDismiss={() => {
            setFormError('');
            clearAuthError();
          }}
        />

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-group">
            <label htmlFor="reg-name-input" className="form-label">
              Full Name
            </label>
            <input
              id="reg-name-input"
              type="text"
              className="form-control"
              placeholder="e.g. Vinay Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email-input" className="form-label">
              Email Address
            </label>
            <input
              id="reg-email-input"
              type="email"
              className="form-control"
              placeholder="vinay@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password-input" className="form-label">
              Password (min 6 characters)
            </label>
            <input
              id="reg-password-input"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password-input" className="form-label">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password-input"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            id="register-submit-button"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loading-inline">
                <span className="spinner-sm"></span> Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link" id="go-to-login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
