// Footer Component - Minimal footer
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          © 2025 - כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
