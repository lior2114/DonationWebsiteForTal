// Donations API service - Updated to use SQL backend
import apiService from './api';

// Polling interval for real-time updates (in milliseconds)
const POLLING_INTERVAL = 30000; // 30 seconds - reduced from 5 seconds to minimize server load

// Add a new donation
export const addDonation = async (donationData) => {
  try {
    const result = await apiService.addDonation(donationData);
    return result.id;
  } catch (error) {
    console.error('Error adding donation:', error);
    throw error;
  }
};

// Get top donors (with smart polling for real-time updates)
export const subscribeToTopDonors = (callback, limitCount = 10) => {
  let intervalId;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  let isTabVisible = true;
  let lastData = null;
  
  const fetchTopDonors = async () => {
    // Don't fetch if tab is not visible (user switched tabs)
    if (!isTabVisible) return;
    
    try {
      const response = await apiService.getTopDonors(limitCount);
      const newData = response.donations || [];
      
      // Only call callback if data actually changed
      if (JSON.stringify(newData) !== JSON.stringify(lastData)) {
        callback(newData);
        lastData = newData;
      }
      
      retryCount = 0; // Reset retry count on success
    } catch (error) {
      console.error('Error fetching top donors:', error);
      retryCount++;
      
      if (retryCount >= MAX_RETRIES) {
        console.warn('Max retries reached for top donors. Stopping polling.');
        callback([]);
        return;
      }
      
      // Return empty array on error
      callback([]);
    }
  };

  // Listen for tab visibility changes
  const handleVisibilityChange = () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
      // Fetch immediately when tab becomes visible again
      fetchTopDonors();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Initial fetch
  fetchTopDonors();
  
  // Set up polling only if we haven't exceeded max retries
  if (retryCount < MAX_RETRIES) {
    intervalId = setInterval(fetchTopDonors, POLLING_INTERVAL);
  }
  
  // Return unsubscribe function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

// Get campaign progress (with smart polling for real-time updates)
export const subscribeToCampaignProgress = (callback) => {
  let intervalId;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  let isTabVisible = true;
  let lastData = null;
  
  const fetchCampaignProgress = async () => {
    // Don't fetch if tab is not visible (user switched tabs)
    if (!isTabVisible) return;
    
    try {
      const response = await apiService.getCampaignProgress();
      // Ensure we have all required fields
      const progressData = {
        totalAmount: response.total_amount || 0,
        totalDonations: response.total_donations || 0,
        goal: response.goal || 10000,
        progress: response.progress || 0
      };
      
      // Only call callback if data actually changed
      if (JSON.stringify(progressData) !== JSON.stringify(lastData)) {
        callback(progressData);
        lastData = progressData;
      }
      
      retryCount = 0; // Reset retry count on success
    } catch (error) {
      console.error('Error fetching campaign progress:', error);
      retryCount++;
      
      if (retryCount >= MAX_RETRIES) {
        console.warn('Max retries reached for campaign progress. Stopping polling.');
        callback({
          totalAmount: 0,
          totalDonations: 0,
          goal: 10000,
          progress: 0
        });
        return;
      }
      
      callback({
        totalAmount: 0,
        totalDonations: 0,
        goal: 10000,
        progress: 0
      });
    }
  };

  // Listen for tab visibility changes
  const handleVisibilityChange = () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
      // Fetch immediately when tab becomes visible again
      fetchCampaignProgress();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Initial fetch
  fetchCampaignProgress();
  
  // Set up polling only if we haven't exceeded max retries
  if (retryCount < MAX_RETRIES) {
    intervalId = setInterval(fetchCampaignProgress, POLLING_INTERVAL);
  }
  
  // Return unsubscribe function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

// Get campaign settings
export const getCampaignSettings = async () => {
  try {
    const response = await apiService.getCampaignSettings();
    return response;
  } catch (error) {
    console.error('Error getting campaign settings:', error);
    // Return default settings on error
    return {
      goal: import.meta.env.VITE_DONATION_GOAL || 10000,
      currency: import.meta.env.VITE_CURRENCY || 'ILS',
      min_donation: import.meta.env.VITE_MIN_DONATION || 10,
      title: 'קמפיין התרומות שלנו',
      description: 'עזרו לנו להגיע למטרה שלנו'
    };
  }
};

// Update campaign settings (admin only)
export const updateCampaignSettings = async (settings) => {
  try {
    const response = await apiService.updateCampaignSettings(settings);
    return response;
  } catch (error) {
    console.error('Error updating campaign settings:', error);
    throw error;
  }
};

// Get donation by transaction ID
export const getDonationByTransactionId = async (transactionId) => {
  try {
    const response = await apiService.getDonationByTransactionId(transactionId);
    return response.donation || null;
  } catch (error) {
    console.error('Error getting donation by transaction ID:', error);
    throw error;
  }
};
