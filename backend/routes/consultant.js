import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleCategories,
  requestConsultation,
  getUserConsultations,
  getAllConsultations,
  updateConsultationStatus
} from '../controllers/consultantController.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/articles', getAllArticles);
router.get('/articles/categories', getArticleCategories);
router.get('/articles/:id', getArticleById);

// Protected routes (user)
router.post('/request', verifyFirebaseToken, requestConsultation);
router.get('/my-consultations', verifyFirebaseToken, getUserConsultations);

// Admin routes
router.post('/articles', verifyFirebaseToken, isAdmin, createArticle);
router.put('/articles/:id', verifyFirebaseToken, isAdmin, updateArticle);
router.delete('/articles/:id', verifyFirebaseToken, isAdmin, deleteArticle);
router.get('/consultations', verifyFirebaseToken, isAdmin, getAllConsultations);
router.put('/consultations/:id', verifyFirebaseToken, isAdmin, updateConsultationStatus);

export default router;
