import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMedicalPackages
} from '../controllers/serviceController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/medical-packages', getMedicalPackages);
router.get('/:id', getServiceById);

// Protected routes (Admin only)
router.post('/', verifyFirebaseToken, isAdmin, createService);
router.put('/:id', verifyFirebaseToken, isAdmin, updateService);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteService);

export default router;
