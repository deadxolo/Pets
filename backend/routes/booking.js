import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingSlots
} from '../controllers/bookingController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/slots', getBookingSlots);

// Protected routes (user)
router.post('/', verifyFirebaseToken, createBooking);
router.get('/my-bookings', verifyFirebaseToken, getUserBookings);
router.put('/:id/cancel', verifyFirebaseToken, cancelBooking);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllBookings);
router.put('/:id/status', verifyFirebaseToken, isAdmin, updateBookingStatus);

export default router;
