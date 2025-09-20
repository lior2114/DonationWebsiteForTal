// Progress Bar Component
import React from 'react';
import { useDonation } from '../../Contexts/DonationContext';
import styles from './ProgressBar.module.css';

const ProgressBar = () => {
  const { campaignProgress, campaignSettings } = useDonation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: campaignSettings.currency || 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('he-IL').format(number);
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <h2 className={styles.progressTitle}>
          {campaignSettings.title || 'קמפיין התרומות שלנו'}
        </h2>
        <p className={styles.progressDescription}>
          {campaignSettings.description || 'עזרו לנו להגיע למטרה שלנו'}
        </p>
      </div>

      <div className={styles.progressStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {formatCurrency(campaignProgress.totalAmount)}
          </span>
          <span className={styles.statLabel}>נתרם עד כה</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {formatCurrency(campaignProgress.goal)}
          </span>
          <span className={styles.statLabel}>מטרה</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {formatNumber(campaignProgress.totalDonations)}
          </span>
          <span className={styles.statLabel}>תרומות</span>
        </div>
      </div>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${Math.min(campaignProgress.progress, 100)}%`,
              transition: 'width 0.8s ease-in-out'
            }}
          />
        </div>
        <div className={styles.progressPercentage}>
          {Math.round(campaignProgress.progress)}%
        </div>
      </div>

      <div className={styles.progressFooter}>
        <p className={styles.progressMessage}>
          {campaignProgress.progress >= 100 
            ? '🎉 הגענו למטרה! תודה לכל התורמים!' 
            : `נותרו ${formatCurrency(campaignProgress.goal - campaignProgress.totalAmount)} להגעה למטרה`
          }
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
