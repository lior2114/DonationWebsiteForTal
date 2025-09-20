// Top Donors Component
import React from 'react';
import { useDonation } from '../../Contexts/DonationContext';
import { Trophy, Heart } from 'lucide-react';
import styles from './TopDonors.module.css';

const TopDonors = () => {
  const { topDonors, campaignSettings } = useDonation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: campaignSettings.currency || 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className={styles.goldIcon} />;
      case 1:
        return <Trophy className={styles.silverIcon} />;
      case 2:
        return <Trophy className={styles.bronzeIcon} />;
      default:
        return <span className={styles.rankNumber}>{index + 1}</span>;
    }
  };

  return (
    <div className={styles.topDonorsContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Trophy className={styles.titleIcon} />
          <h3 className={styles.title}>התורמים המובילים</h3>
        </div>
      </div>

      <div className={styles.donorsList}>
        {topDonors.length === 0 ? (
          <div className={styles.emptyState}>
            <Heart className={styles.emptyIcon} />
            <p className={styles.emptyText}>אין תרומות עדיין</p>
            <p className={styles.emptySubtext}>היו הראשונים לתרום!</p>
          </div>
        ) : (
          topDonors.map((donor, index) => (
            <div key={donor.id} className={styles.donorItem}>
              <div className={styles.donorRank}>
                {getRankIcon(index)}
              </div>
              
              <div className={styles.donorInfo}>
                <div className={styles.donorName}>
                  {donor.anonymous ? 'תורם אנונימי' : (donor.name || 'תורם')}
                </div>
                <div className={styles.donorDate}>
                  {formatDate(donor.timestamp)}
                </div>
                {donor.message && (
                  <div className={styles.donorMessage}>
                    "{donor.message}"
                  </div>
                )}
              </div>
              
              <div className={styles.donorAmount}>
                {formatCurrency(donor.amount)}
              </div>
            </div>
          ))
        )}
      </div>

      {topDonors.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            {topDonors.length} תרומות
          </p>
        </div>
      )}
    </div>
  );
};

export default TopDonors;
