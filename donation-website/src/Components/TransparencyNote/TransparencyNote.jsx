// Transparency Note Component - Simple transparency message
import React from 'react';
import styles from './TransparencyNote.module.css';

const TransparencyNote = () => {
  return (
    <div className={styles.transparencyNote}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>🛡️</span>
      </div>
      <p className={styles.noteText}>
        כל התרומות מיועדות לסלי מזון למשפחות נצרכות.
      </p>
    </div>
  );
};

export default TransparencyNote;
