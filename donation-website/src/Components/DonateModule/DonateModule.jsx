// Donate Module Component - Direct link to Meshulam payment
import React from 'react';
import styles from './DonateModule.module.css';

const DonateModule = ({ onDonate }) => {
  const handleDonate = () => {
    // Redirect to Meshulam payment page
    window.open('https://meshulam.co.il/quick_payment?b=59f8e5dec336a47f5e2cbecdbfe35fcb', '_blank');
  };

  return (
    <div className={styles.donateModule}>
      <h3 className={styles.moduleTitle}>תרומה לקמפיין</h3>
      
      <p className={styles.firstp}>
        לחץ על הכפתור למטה כדי לתרום דרך מערכת התשלומים המאובטחת של Meshulam
        </p>
        <p className={styles.donateDescription}>
        כשתועברו לעמוד התשלום, יופיע שדה בשם: שם מלא (חובה), זהו השם שיופיע באתר ובסרטון
      אם אתם מעדיפים להישאר אנונימיים, תוכלו לרשום אנונימי/ת או רק שם פרטי אם תרצו, תודה.🙏

      </p>

      <button
        onClick={handleDonate}
        className={styles.donateButton}
      >
        תרומה עכשיו
      </button>
    </div>
  );
};

export default DonateModule;
