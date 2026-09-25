import React from 'react';

/**
 * Loading spinner component
 * @param {object} props - { fullPage, message }
 */
const Loading = ({ fullPage = false, message = 'Loading...' }) => {
  const content = (
    <div className="loading-container" id="loading-spinner">
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-overlay" id="fullpage-loading">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
