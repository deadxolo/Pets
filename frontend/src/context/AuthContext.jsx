import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../config/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Fetch user profile from backend
          const response = await api.get('/auth/profile');
          setUserProfile(response.data.user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setupRecaptcha = (phoneNumber) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
          toast.error('reCAPTCHA expired. Please try again.');
        }
      });
    }
    return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  };

  const verifyOTP = async (confirmationResult, otp) => {
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      // Send token to backend
      const response = await api.post('/auth/verify-otp', {
        idToken,
        phoneNumber: result.user.phoneNumber
      });

      setUserProfile(response.data.user);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      setUserProfile(response.data.user);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const addPet = async (petData) => {
    try {
      const response = await api.post('/auth/add-pet', petData);
      setUserProfile({
        ...userProfile,
        profile: {
          ...userProfile.profile,
          pets: [...(userProfile.profile?.pets || []), response.data.pet]
        }
      });
      toast.success('Pet added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('Failed to add pet');
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    setupRecaptcha,
    verifyOTP,
    signOut,
    updateProfile,
    addPet
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
