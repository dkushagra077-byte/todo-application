import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar component for top-level navigation and user status
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container" id="main-navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" id="nav-brand-logo">
          <span className="brand-icon">✓</span>
          <span className="brand-text">TodoStack</span>
        </Link>

        <nav className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user-section">
              <div className="user-badge" id="nav-user-badge" title={user?.email}>
                <span className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                id="logout-button"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-link">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-link">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
