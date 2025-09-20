// API service for SQL backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Donation operations
  async addDonation(donationData) {
    return this.request('/add_donation', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async getTopDonors(limit = 10) {
    return this.request(`/get_top_donations?limit=${limit}`);
  }

  async getTotalAmount() {
    return this.request('/get_total_amount');
  }

  async getDonationByTransactionId(transactionId) {
    return this.request(`/get_donation_by_transaction_id?transaction_id=${transactionId}`);
  }

  // Campaign operations
  async getCampaignProgress() {
    return this.request('/get_campaign_progress');
  }

  async getCampaignSettings() {
    return this.request('/get_campaign_settings');
  }

  async updateCampaignSettings(settings) {
    return this.request('/update_campaign_settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Database management
  async createTable() {
    return this.request('/create_table', {
      method: 'POST',
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
