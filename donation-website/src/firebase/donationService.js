import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

// Collections
const DONATIONS_COLLECTION = "donations";
const CAMPAIGN_SETTINGS_COLLECTION = "campaign_settings";

// Donation Service
export class DonationService {
  
  // Add a new donation
  static async addDonation(donationData) {
    try {
      const donation = {
        name: donationData.name || 'אנונימי',
        amount: parseInt(donationData.amount),
        email: donationData.email || null,
        phone: donationData.phone || null,
        message: donationData.message || null,
        transaction_id: donationData.transaction_id || null,
        payment_method: donationData.payment_method || 'unknown',
        status: 'completed',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), donation);
      
      return {
        success: true,
        id: docRef.id,
        message: "תרומה נוספה בהצלחה"
      };
    } catch (error) {
      console.error("❌ Error adding donation: ", error);
      throw error;
    }
  }

  // Add amount only (hidden from donors list)
  static async addAmountOnly(amount, description = "עדכון ידני") {
    try {
      const donation = {
        name: 'עדכון ידני',
        amount: parseInt(amount),
        email: '',
        phone: '',
        message: description,
        transaction_id: `manual_${Date.now()}`,
        payment_method: 'manual',
        status: 'completed',
        hidden_from_donors_list: true, // לא יופיע ברשימת תורמים
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), donation);
      
      return {
        success: true,
        id: docRef.id,
        message: `נוסף ${amount} ₪ לסכום הכולל`
      };
    } catch (error) {
      console.error("❌ Error adding amount: ", error);
      throw error;
    }
  }

  // Get top donations
  static async getTopDonations(donationLimit = 10) {
    try {
      const q = query(
        collection(db, DONATIONS_COLLECTION),
        orderBy("amount", "desc"),
        limit(donationLimit * 2) // Get more to filter
      );
      
      const querySnapshot = await getDocs(q);
      const donations = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Filter out manual updates
        if (data.name === 'עדכון ידני' || 
            data.name === 'החסרה ידנית' || 
            data.hidden_from_donors_list === true) {
          return; // Skip manual updates
        }
        
        donations.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to string for consistency
          created_at: data.created_at?.toDate?.()?.toISOString() || null,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || null
        });
      });

      // Return only the requested number
      return donations.slice(0, donationLimit);
    } catch (error) {
      console.error("❌ Error getting top donations: ", error);
      // Return empty array when Firebase fails
      return [];
    }
  }

  // Get total donations amount
  static async getTotalAmount() {
    try {
      const querySnapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
      let total = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.amount && data.status === 'completed') {
          total += parseInt(data.amount);
        }
      });

      return total;
    } catch (error) {
      console.error("❌ Error getting total amount: ", error);
      // Return 0 when Firebase fails
      return 0;
    }
  }

  // Get donations count
  static async getDonationsCount() {
    try {
      const querySnapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
      return querySnapshot.size;
    } catch (error) {
      console.error("❌ Error getting donations count: ", error);
      throw error;
    }
  }

  // Get campaign progress (total amount + goal)
  static async getCampaignProgress() {
    try {
      const [totalAmount, settings] = await Promise.all([
        this.getTotalAmount(),
        this.getCampaignSettings()
      ]);

      const goal = settings.goal || 200000;
      const percentage = Math.min((totalAmount / goal) * 100, 100);

      return {
        current: totalAmount,
        goal: goal,
        percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        remaining: Math.max(goal - totalAmount, 0)
      };
    } catch (error) {
      console.error("❌ Error getting campaign progress: ", error);
      throw error;
    }
  }

  // Get campaign settings
  static async getCampaignSettings() {
    try {
      const settingsRef = doc(db, CAMPAIGN_SETTINGS_COLLECTION, "main");
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        return settingsSnap.data();
      } else {
        // Create default settings if they don't exist
        const defaultSettings = {
          goal: 10000,
          currency: 'ILS',
          min_donation: 10,
          title: 'קמפיין התרומות שלנו',
          description: 'עזרו לנו להגיע למטרה שלנו',
          updated_at: serverTimestamp()
        };
        
        await setDoc(settingsRef, defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error("❌ Error getting campaign settings: ", error);
      // Return default settings when Firebase fails
      return {
        goal: 10000,
        currency: 'ILS',
        min_donation: 10,
        title: 'קמפיין התרומות שלנו',
        description: 'עזרו לנו להגיע למטרה שלנו'
      };
    }
  }

  // Update campaign settings
  static async updateCampaignSettings(settings) {
    try {
      const settingsRef = doc(db, CAMPAIGN_SETTINGS_COLLECTION, "main");
      await updateDoc(settingsRef, {
        ...settings,
        updated_at: serverTimestamp()
      });
      
      return { success: true, message: "הגדרות עודכנו בהצלחה" };
    } catch (error) {
      console.error("❌ Error updating campaign settings: ", error);
      throw error;
    }
  }

  // Real-time listener for donations (for live updates)
  static onDonationsChange(callback) {
    try {
      const q = query(
        collection(db, DONATIONS_COLLECTION),
        orderBy("created_at", "desc")
      );
      
      return onSnapshot(q, 
        (snapshot) => {
          const donations = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Filter out manual updates
            if (data.name === 'עדכון ידני' || 
                data.name === 'החסרה ידנית' || 
                data.hidden_from_donors_list === true) {
              return; // Skip manual updates
            }
            
            donations.push({
              id: doc.id,
              ...data,
              created_at: data.created_at?.toDate?.()?.toISOString() || null,
              updated_at: data.updated_at?.toDate?.()?.toISOString() || null
            });
          });
          callback(donations);
        },
        (error) => {
          console.error('❌ Firebase: Error in donations listener:', error);
          // Fallback to empty array on error
          callback([]);
        }
      );
    } catch (error) {
      console.error('❌ Firebase: Error setting up donations listener:', error);
      // Return a dummy unsubscribe function and call callback with empty array
      callback([]);
      return () => {};
    }
  }

  // Real-time listener for campaign progress
  static onProgressChange(callback) {
    try {
      const q = collection(db, DONATIONS_COLLECTION);
      
      return onSnapshot(q, 
        async (snapshot) => {
          try {
            const progress = await this.getCampaignProgress();
            callback(progress);
          } catch (error) {
            console.error("❌ Error in progress listener: ", error);
            // Fallback to default progress
            callback({ current: 0, goal: 10000, percentage: 0, remaining: 10000 });
          }
        },
        (error) => {
          console.error('❌ Firebase: Error in progress listener:', error);
          // Fallback to default progress on error
          callback({ current: 0, goal: 10000, percentage: 0, remaining: 10000 });
        }
      );
    } catch (error) {
      console.error('❌ Firebase: Error setting up progress listener:', error);
      // Return a dummy unsubscribe function and call callback with default progress
      callback({ current: 0, goal: 10000, percentage: 0, remaining: 10000 });
      return () => {};
    }
  }
}

export default DonationService;
