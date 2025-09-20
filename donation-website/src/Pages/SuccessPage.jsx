// Success Page Component
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Heart, ArrowRight } from 'lucide-react';
// Removed creditCard import - using Meshulam payment system
import ThemeToggle from '../Components/ThemeToggle/ThemeToggle';
import styles from './SuccessPage.module.css';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get payment data from URL parameters (if any)
    const amount = searchParams.get('amount');
    const donorName = searchParams.get('donor_name');
    
    if (amount) {
      setPaymentData({ 
        amount: parseFloat(amount),
        donor_name: donorName || 'תורם'
      });
    }
  }, [searchParams]);

  // Removed loading and error states - using Meshulam payment system

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.themeToggleContainer}>
          <ThemeToggle />
        </div>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle className={styles.checkIcon} />
          </div>
          
          <h1 className={styles.successTitle}>
            תודה על התרומה שלך!
          </h1>
          
          <p className={styles.successMessage}>
            התרומה שלך התקבלה בהצלחה ותעזור לנו להגיע למטרה שלנו.
            <br />
            תקבל אישור באימייל בקרוב.
          </p>
          
          {paymentData && (
            <div className={styles.paymentInfo}>
              <p className={styles.paymentLabel}>סכום התרומה:</p>
              <p className={styles.paymentAmount}>{paymentData.amount.toLocaleString()} ₪</p>
              {paymentData.donor_name && (
                <p className={styles.donorName}>תודה {paymentData.donor_name}!</p>
              )}
            </div>
          )}
          
          {/* Removed payment ID display - using Meshulam payment system */}
          
          <div className={styles.actions}>
            <Link to="/" className={styles.homeButton}>
              <ArrowRight className={styles.buttonIcon} />
              חזרה לעמוד הראשי
            </Link>
            
            <button 
              className={styles.shareButton}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'תרמתי לקמפיין התרומות',
                    text: 'הצטרפו אליי ותרמו גם אתם!',
                    url: window.location.origin
                  });
                } else {
                  // Fallback - copy to clipboard
                  navigator.clipboard.writeText(window.location.origin);
                  alert('הקישור הועתק ללוח');
                }
              }}
            >
              <Heart className={styles.buttonIcon} />
              שתף עם חברים
            </button>
          </div>
        </div>
        
        <div className={styles.impactSection}>
          <h2 className={styles.impactTitle}>ההשפעה שלך</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>🎯</div>
              <h3>מטרה משותפת</h3>
              <p>כל תרומה מקרבת אותנו למטרה שלנו</p>
            </div>
            
            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>🤝</div>
              <h3>קהילה חזקה</h3>
              <p>אנחנו ביחד יכולים לעשות הבדל גדול</p>
            </div>
            
            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>💝</div>
              <h3>תרומה משמעותית</h3>
              <p>התרומה שלך תעזור לאנשים רבים</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
