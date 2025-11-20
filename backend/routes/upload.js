import express from 'express';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';
import * as uploadController from '../controllers/uploadController.js';

const router = express.Router();

// Upload single image (admin only)
router.post('/single',
  verifyFirebaseToken,
  isAdmin,
  uploadController.uploadSingle,
  uploadController.uploadToFirebase
);

// Upload multiple images (admin only)
router.post('/multiple',
  verifyFirebaseToken,
  isAdmin,
  uploadController.uploadMultiple,
  uploadController.uploadMultipleToFirebase
);

// Delete file (admin only)
router.delete('/', verifyFirebaseToken, isAdmin, uploadController.deleteFromFirebase);

export default router;
