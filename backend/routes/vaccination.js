import express from 'express';
import {
  addVaccinationRecord,
  getUserVaccinations,
  getAllVaccinations,
  updateVaccinationRecord,
  deleteVaccinationRecord,
  getUpcomingVaccinations,
  getVaccinationSchedule
} from '../controllers/vaccinationController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/schedule', getVaccinationSchedule);

// Protected routes (user)
router.post('/', verifyFirebaseToken, addVaccinationRecord);
router.get('/my-vaccinations', verifyFirebaseToken, getUserVaccinations);
router.get('/upcoming', verifyFirebaseToken, getUpcomingVaccinations);
router.put('/:id', verifyFirebaseToken, updateVaccinationRecord);
router.delete('/:id', verifyFirebaseToken, deleteVaccinationRecord);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllVaccinations);

export default router;
