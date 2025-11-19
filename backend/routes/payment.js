import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentDetails,
  initiateRefund,
  createServicePayment,
  verifyServicePayment
} from '../controllers/paymentController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/create-order', verifyFirebaseToken, createRazorpayOrder);
router.post('/verify', verifyFirebaseToken, verifyPayment);
router.post('/service/create', verifyFirebaseToken, createServicePayment);
router.post('/service/verify', verifyFirebaseToken, verifyServicePayment);

// Admin routes
router.get('/:paymentId', verifyFirebaseToken, isAdmin, getPaymentDetails);
router.post('/refund', verifyFirebaseToken, isAdmin, initiateRefund);

export default router;
