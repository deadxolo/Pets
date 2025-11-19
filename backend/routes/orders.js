import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (user)
router.post('/', verifyFirebaseToken, createOrder);
router.get('/my-orders', verifyFirebaseToken, getUserOrders);
router.get('/:id', verifyFirebaseToken, getOrderById);
router.put('/:id/cancel', verifyFirebaseToken, cancelOrder);
router.put('/:id/payment-status', verifyFirebaseToken, updatePaymentStatus);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyFirebaseToken, isAdmin, updateOrderStatus);

export default router;
