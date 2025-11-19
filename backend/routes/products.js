import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getCategories
} from '../controllers/productController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Protected routes (user)
router.post('/:id/review', verifyFirebaseToken, addProductReview);

// Admin routes
router.post('/', verifyFirebaseToken, isAdmin, createProduct);
router.put('/:id', verifyFirebaseToken, isAdmin, updateProduct);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteProduct);

export default router;
