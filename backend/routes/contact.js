import express from 'express';
import {
  submitContactForm,
  getAllContacts,
  updateContactStatus,
  getContactInfo
} from '../controllers/contactController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/submit', submitContactForm);
router.get('/info', getContactInfo);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllContacts);
router.put('/:id/status', verifyFirebaseToken, isAdmin, updateContactStatus);

export default router;
