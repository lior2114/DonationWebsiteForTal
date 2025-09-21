// Firebase Donations API service
import DonationService from '../firebase/donationService';
// import '../firebase/initData'; // DISABLED - Don't auto-add sample data

// Add a new donation
export const addDonation = async (donationData) => {
  try {
    const result = await DonationService.addDonation(donationData);
    return result.id;
  } catch (error) {
    console.error('❌ Error adding donation:', error);
    throw error;
  }
};

// Add amount only (hidden from donors list)
export const addAmountOnly = async (amount, description = "עדכון ידני") => {
  try {
    const result = await DonationService.addAmountOnly(amount, description);
    return result;
  } catch (error) {
    console.error('❌ Error adding amount:', error);
    throw error;
  }
};

// Get top donors with real-time Firebase listeners
export const subscribeToTopDonors = (callback, limitCount = 10) => {
  let unsubscribe = null;
  
  const startListening = () => {
    try {
      // Use Firebase real-time listener
      unsubscribe = DonationService.onDonationsChange((donations) => {
        // Get top donors by amount (already filtered in DonationService)
        const topDonors = donations
          .filter(donation => donation.status === 'completed' && donation.amount > 0)
          .sort((a, b) => b.amount - a.amount)
          .slice(0, limitCount)
          .map(donation => ({
            id: donation.id,
            name: donation.name || 'אנונימי',
            amount: donation.amount,
            message: donation.message || null,
            created_at: donation.created_at
          }));
        
        callback(topDonors);
      });
      
    } catch (error) {
      console.error('❌ Error starting top donors listener:', error);
      // Fallback to one-time fetch
      fallbackFetch();
    }
  };
  
  const fallbackFetch = async () => {
    try {
      const donations = await DonationService.getTopDonations(limitCount);
      const topDonors = donations.map(donation => ({
        id: donation.id,
        name: donation.name || 'אנונימי',
        amount: donation.amount,
        message: donation.message || null,
        created_at: donation.created_at
      }));
      
      callback(topDonors);
    } catch (error) {
      console.error('❌ Fallback fetch failed:', error);
      callback([]);
    }
  };
  
  // Start listening immediately
  startListening();
  
  // Return cleanup function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Get campaign progress with real-time updates
export const subscribeToCampaignProgress = (callback) => {
  let unsubscribe = null;
  
  const startListening = () => {
    try {
      // Use Firebase real-time listener for progress
      unsubscribe = DonationService.onProgressChange((progress) => {
        callback(progress);
      });
      
    } catch (error) {
      console.error('❌ Error starting campaign progress listener:', error);
      // Fallback to one-time fetch
      fallbackFetch();
    }
  };
  
  const fallbackFetch = async () => {
    try {
      const progress = await DonationService.getCampaignProgress();
      callback(progress);
    } catch (error) {
      console.error('❌ Fallback progress fetch failed:', error);
      callback({ current: 0, goal: 200000, percentage: 0, remaining: 200000 });
    }
  };
  
  // Start listening immediately
  startListening();
  
  // Return cleanup function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Get total donations amount (one-time fetch)
export const getTotalAmount = async () => {
  try {
    const total = await DonationService.getTotalAmount();
    return total;
  } catch (error) {
    console.error('❌ Error getting total amount:', error);
    return 0;
  }
};

// Get donations count (one-time fetch)
export const getDonationsCount = async () => {
  try {
    const count = await DonationService.getDonationsCount();
    return count;
  } catch (error) {
    console.error('❌ Error getting donations count:', error);
    return 0;
  }
};

// Get campaign progress (one-time fetch)
export const getCampaignProgress = async () => {
  try {
    const progress = await DonationService.getCampaignProgress();
    return progress;
    } catch (error) {
      console.error('❌ Error getting campaign progress:', error);
      return { current: 0, goal: 10000, percentage: 0, remaining: 10000 };
    }
};

// Get campaign settings
export const getCampaignSettings = async () => {
  try {
    const settings = await DonationService.getCampaignSettings();
    return settings;
  } catch (error) {
    console.error('❌ Error getting campaign settings:', error);
    return {
      goal: 10000,
      currency: 'ILS',
      min_donation: 10,
      title: 'קמפיין התרומות שלנו',
      description: 'עזרו לנו להגיע למטרה שלנו'
    };
  }
};

// Update campaign settings (for admin use)
export const updateCampaignSettings = async (settings) => {
  try {
    const result = await DonationService.updateCampaignSettings(settings);
    return result;
  } catch (error) {
    console.error('❌ Error updating campaign settings:', error);
    throw error;
  }
};

// Legacy compatibility - keep these exports for backward compatibility
export default {
  addDonation,
  subscribeToTopDonors,
  subscribeToCampaignProgress,
  getTotalAmount,
  getDonationsCount,
  getCampaignProgress,
  getCampaignSettings,
  updateCampaignSettings
};