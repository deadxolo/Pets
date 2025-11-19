import express from 'express';
import {
  createAppointment,
  getUserAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots
} from '../controllers/appointmentController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableSlots);

// Protected routes (user)
router.post('/', verifyFirebaseToken, createAppointment);
router.get('/my-appointments', verifyFirebaseToken, getUserAppointments);
router.get('/:id', verifyFirebaseToken, getAppointmentById);
router.put('/:id/cancel', verifyFirebaseToken, cancelAppointment);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllAppointments);
router.put('/:id/status', verifyFirebaseToken, isAdmin, updateAppointmentStatus);

export default router;
