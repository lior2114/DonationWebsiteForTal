// Home Page Component
import React from 'react';
import { useDonation } from '../Contexts/DonationContext';
// Removed Stripe import - using internal payment system
import PageShell from '../Components/PageShell/PageShell';
import Hero from '../Components/Hero/Hero';
import Progress from '../Components/Progress/Progress';
import CampaignText from '../Components/CampaignText/CampaignText';
import DonateModule from '../Components/DonateModule/DonateModule';
import TransparencyNote from '../Components/TransparencyNote/TransparencyNote';
import Footer from '../Components/Footer/Footer';
import ErrorMessage from '../Components/ErrorMessage/ErrorMessage';
import TopDonors from '../Components/TopDonors/TopDonors';
import MainContent from '../Components/MainContent/MainContent';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { campaignProgress, campaignSettings, setError, error, clearError } = useDonation();
  
  // Sample data - in real implementation these would come from props or context
  const titleFromClient = " השם הפקות Tal Tastic X";
  const subtitleFromClient = "100 ימים 100 סרטונים - 10,000 שקל";
  const campaignTextFromClient = `בתקופה האחרונה נחשפתי להרבה משפחות שנקלעו לקשיים כלכליים ולא יכולות לקנות מוצרי מזון בסיסיים, והחלטתי לעזור להן.
אני טל טסטיק, ולפני זמן קצר הכרתי את סיון אבישג מעמותת "ה' הפקות". מאוד התרשמתי מהעבודה שלהם ומכמה שהם רוצים לעזור בלי לקבל כלום בתמורה! 
החלטתי להקדיש את פרויקט 100 הימים שלי ולעזור להם - יחד אתכם!
העמותה עושה הרבה דברים: מחלקת סלי מזון למשפחות, מסייעת בהפקת בר\ת מצווה לילדים שבאים ממשפחות עם קושי כלכלי ותומכת במשפחות בזמנים קשים.
התרומות שנאסוף יהיו מיועדות ישירות לקטגוריה של סלי מזון למשפחות נזקקות.
350  שקלים = סל קניות מלא / סל תינוקות מלא
גם תרומה קטנה של 5-10 שקלים חשובה ותהווה חלק מהפרויקט! 
למעשה, ברוב הפרויקטים מסוג זה התרומות הקטנות הן שיוצרות את ההשפעה הגדולה ביותר – ולכן כל תרומה משמעותית! 🙂`;

  const handleDonateClick = () => {
    // Scroll to donate module or open it
    const donateModule = document.querySelector('[data-donate-module]');
    if (donateModule) {
      donateModule.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDonate = () => {
    // Redirect to Meshulam payment page
    window.open('https://meshulam.co.il/quick_payment?b=59f8e5dec336a47f5e2cbecdbfe35fcb', '_blank');
  };

  return (
    <PageShell>
      <Hero
        title={titleFromClient}
        subtitle={subtitleFromClient}
        onDonateClick={handleDonateClick}
      />
      {error && <ErrorMessage message={error} onClose={clearError} />}
      <Progress 
        targetAmount={campaignProgress.goal || campaignSettings.goal || 10000} 
        raisedAmount={campaignProgress.totalAmount || 0} 
      />
      {/* Campaign Text with Top Donors on the side */}
      <MainContent>
        {/* Left Column - Campaign Text */}
        <div style={{ flex: '2' }}>
          <div className={styles.campaignTextContainer}>
            <CampaignText content={campaignTextFromClient} />
          </div>
        </div>
        
        {/* Right Column - Top Donors */}
        <div style={{ flex: '1' }}>
          <TopDonors />
        </div>
      </MainContent>
      
      {/* Donation Module - Full Width */}
      <div data-donate-module>
        <DonateModule onDonate={handleDonate} />
      </div>
      
      <TransparencyNote />
      <Footer />
    </PageShell>
  );
};

export default HomePage;
