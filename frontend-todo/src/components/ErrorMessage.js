import React from 'react';

/**
 * ErrorMessage banner component
 * @param {object} props - { message, onDismiss }
 */
const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner" id="error-message-banner" role="alert">
      <div className="error-icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="error-text">
        <p className="error-message">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="error-dismiss-btn"
          onClick={onDismiss}
          aria-label="Dismiss error"
          id="dismiss-error-button"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
