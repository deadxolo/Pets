import express from 'express';
import {
  verifyPhoneOTP,
  getUserProfile,
  updateUserProfile,
  addPet,
  logout
} from '../controllers/authController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/verify-otp', verifyPhoneOTP);

// Protected routes (require authentication)
router.get('/profile', verifyFirebaseToken, getUserProfile);
router.put('/profile', verifyFirebaseToken, updateUserProfile);
router.post('/add-pet', verifyFirebaseToken, addPet);
router.post('/logout', verifyFirebaseToken, logout);

export default router;
