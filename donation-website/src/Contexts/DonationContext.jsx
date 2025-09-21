// Donation Context for global state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  subscribeToTopDonors, 
  subscribeToCampaignProgress, 
  getCampaignSettings 
} from '../api/donations';

// Initial state
const initialState = {
  topDonors: [],
  campaignProgress: {
    totalAmount: 0,
    totalDonations: 0,
    goal: 10000,
    progress: 0
  },
  campaignSettings: {
    goal: 10000,
    currency: 'ILS',
    minDonation: 10,
    title: 'קמפיין התרומות שלנו',
    description: 'עזרו לנו להגיע למטרה שלנו'
  },
  loading: true,
  error: null
};

// Action types
const ActionTypes = {
  SET_TOP_DONORS: 'SET_TOP_DONORS',
  SET_CAMPAIGN_PROGRESS: 'SET_CAMPAIGN_PROGRESS',
  SET_CAMPAIGN_SETTINGS: 'SET_CAMPAIGN_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const donationReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_TOP_DONORS:
      return {
        ...state,
        topDonors: action.payload,
        loading: false
      };
    
    case ActionTypes.SET_CAMPAIGN_PROGRESS:
      return {
        ...state,
        campaignProgress: action.payload,
        loading: false
      };
    
    case ActionTypes.SET_CAMPAIGN_SETTINGS:
      return {
        ...state,
        campaignSettings: action.payload,
        loading: false
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const DonationContext = createContext();

// Provider component
export const DonationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(donationReducer, initialState);

  // Load campaign settings on mount
  useEffect(() => {
    const loadCampaignSettings = async () => {
      try {
        const settings = await getCampaignSettings();
        dispatch({ type: ActionTypes.SET_CAMPAIGN_SETTINGS, payload: settings });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    };

    loadCampaignSettings();
  }, []);

  // Subscribe to top donors
  useEffect(() => {
    const unsubscribe = subscribeToTopDonors((donors) => {
      dispatch({ type: ActionTypes.SET_TOP_DONORS, payload: donors });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Subscribe to campaign progress
  useEffect(() => {
    const unsubscribe = subscribeToCampaignProgress((progress) => {
      dispatch({ type: ActionTypes.SET_CAMPAIGN_PROGRESS, payload: progress });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Context value
  const value = {
    ...state,
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error })
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};

// Custom hook to use donation context
export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};

export default DonationContext;
