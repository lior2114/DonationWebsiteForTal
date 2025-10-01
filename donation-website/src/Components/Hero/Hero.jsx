// Hero Component - Main title and CTA section
import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Hero.module.css';

const Hero = ({ title, subtitle, onDonateClick }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
        </div>
        <h2 className={styles.heroSubtitle}>{subtitle}</h2>
        
        <button 
          className={styles.ctaButton}
          onClick={onDonateClick}
          aria-label="תרום עכשיו"
        >
          תרום עכשיו
        </button>
        
        <p className={styles.helpText}>
          כל תרומה נחשבת, גם 5–10 ₪.
        </p>
      </div>
    </div>
  );
};

export default Hero;
