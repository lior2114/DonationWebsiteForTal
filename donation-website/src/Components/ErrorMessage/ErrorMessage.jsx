// Error Message Component - Display error messages
import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.errorMessage} role="alert">
      <div className={styles.errorContent}>
        <span className={styles.errorIcon}>⚠️</span>
        <span className={styles.errorText}>{message}</span>
        {onClose && (
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="סגור הודעת שגיאה"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
