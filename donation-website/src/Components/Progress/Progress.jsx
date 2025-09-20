// Progress Component - Shows campaign progress with basket calculation
import React from 'react';
import styles from './Progress.module.css';

const Progress = ({ targetAmount = 10000, raisedAmount = 0 }) => {
  const progressPercentage = Math.min((raisedAmount / targetAmount) * 100, 100);
  const fundedBaskets = Math.floor(raisedAmount / 350);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('he-IL').format(number);
  };

  return (
    <div className={styles.progress}>
      <div className={styles.progressStats}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>היעד:</span>
          <span className={styles.statValue}>
            {formatCurrency(targetAmount)}
          </span>
        </div>
        
        <div className={styles.statRow}>
          <span className={styles.statLabel}>נאספו:</span>
          <span className={styles.statValue}>
            {formatCurrency(raisedAmount)} | מומנו: {formatNumber(fundedBaskets)} סלים
          </span>
        </div>
      </div>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${progressPercentage}%`,
              transition: 'width 0.8s ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Progress;
