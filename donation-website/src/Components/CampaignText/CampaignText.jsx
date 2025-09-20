// Campaign Text Component - Displays text content exactly as received
import React from 'react';
import styles from './CampaignText.module.css';

const CampaignText = ({ content }) => {
  if (!content) return null;
  
  return (
    <div className={styles.campaignText}>
      <div className={styles.textContent}>
        {content}
      </div>
    </div>
  );
};

export default CampaignText;
