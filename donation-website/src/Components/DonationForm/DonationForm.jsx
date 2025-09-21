// Donation Form Component
import React, { useState } from 'react';
import { useDonation } from '../../Contexts/DonationContext';
// import { createPaymentIntent, validateDonationAmount } from '../../api/creditCard'; // Removed - using Firebase now
import { Heart, CreditCard, User, Mail, MessageSquare, Eye, EyeOff } from 'lucide-react';
import styles from './DonationForm.module.css';

const DonationForm = () => {
  const { campaignSettings, setError, clearError } = useDonation();
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    amount: campaignSettings.minDonation || 10,
    message: '',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    clearError();
  };

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({ ...prev, amount }));
    setShowAmountInput(false);
  };

  const handleCustomAmount = () => {
    setShowAmountInput(true);
  };

  const validateForm = () => {
    if (!formData.anonymous && !formData.donorName.trim()) {
      setError('אנא הזן שם או בחר תרומה אנונימית');
      return false;
    }
    
    // Simple amount validation (replaced validateDonationAmount)
    const minAmount = campaignSettings.minDonation || 10;
    const amountValidation = {
      isValid: formData.amount >= minAmount,
      message: formData.amount < minAmount ? `הסכום המינימלי הוא ${minAmount} ₪` : ''
    };
    if (!amountValidation.isValid) {
      setError(amountValidation.message);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    clearError();
    
    try {
      // Redirect to payment page with credit card form
      const params = new URLSearchParams({
        amount: formData.amount,
        donorName: formData.donorName,
        email: formData.email,
        message: formData.message,
        anonymous: formData.anonymous
      });
      
      window.location.href = `/payment?${params.toString()}`;
      
      // Reset form after successful redirect
      setFormData({
        donorName: '',
        email: '',
        amount: campaignSettings.minDonation || 10,
        message: '',
        anonymous: false
      });
      
    } catch (error) {
      console.error('Error processing donation:', error);
      setError(`שגיאה בעיבוד התרומה: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: campaignSettings.currency || 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const presetAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className={styles.donationFormContainer}>
      <div className={styles.formHeader}>
        <Heart className={styles.headerIcon} />
        <h3 className={styles.formTitle}>תרום עכשיו</h3>
        <p className={styles.formSubtitle}>כל תרומה עוזרת להגיע למטרה</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.donationForm}>
        {/* Donor Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <User className={styles.labelIcon} />
            שם התורם
          </label>
          <input
            type="text"
            name="donorName"
            value={formData.donorName}
            onChange={handleInputChange}
            disabled={formData.anonymous}
            placeholder={formData.anonymous ? 'תרומה אנונימית' : 'הזן את שמך'}
            className={`${styles.input} ${formData.anonymous ? styles.disabled : ''}`}
          />
        </div>

        {/* Anonymous Checkbox */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              {formData.anonymous ? <EyeOff size={16} /> : <Eye size={16} />}
              תרומה אנונימית
            </span>
          </label>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Mail className={styles.labelIcon} />
            אימייל (אופציונלי)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className={styles.input}
          />
        </div>

        {/* Amount Selection */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <CreditCard className={styles.labelIcon} />
            סכום התרומה (כרטיס אשראי בלבד)
          </label>
          
          <div className={styles.amountPresets}>
            {presetAmounts.map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`${styles.amountButton} ${
                  formData.amount === amount ? styles.amountButtonActive : ''
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
            <button
              type="button"
              onClick={handleCustomAmount}
              className={`${styles.amountButton} ${
                !presetAmounts.includes(formData.amount) ? styles.amountButtonActive : ''
              }`}
            >
              סכום אחר
            </button>
          </div>

          {showAmountInput && (
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min={campaignSettings.minDonation || 10}
              placeholder="הזן סכום"
              className={styles.input}
              autoFocus
            />
          )}
        </div>

        {/* Message */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <MessageSquare className={styles.labelIcon} />
            הודעה (אופציונלי)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="הודעה אישית..."
            className={styles.textarea}
            rows={3}
            maxLength={200}
          />
          <div className={styles.charCount}>
            {formData.message.length}/200
          </div>
        </div>

        {/* Payment Method Info */}
        <div className={styles.paymentInfo}>
          <CreditCard className={styles.paymentIcon} />
          <span className={styles.paymentText}>
            תשלום מאובטח בכרטיס אשראי
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <>
              <div className={styles.spinner} />
              מעבד...
            </>
          ) : (
            <>
              <CreditCard className={styles.submitIcon} />
              תרום {formatCurrency(formData.amount)} בכרטיס אשראי
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
