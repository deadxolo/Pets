import express from 'express';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.js';
import * as siteSettingsController from '../controllers/siteSettingsController.js';

const router = express.Router();

// Public routes
router.get('/settings', siteSettingsController.getAllSettings);
router.get('/hero-sections', siteSettingsController.getHeroSections);
router.get('/features', siteSettingsController.getFeatures);
router.get('/navigation', siteSettingsController.getNavigation);

// Admin only routes
router.put('/settings', verifyFirebaseToken, isAdmin, siteSettingsController.updateSettings);

// Hero sections management
router.post('/hero-sections', verifyFirebaseToken, isAdmin, siteSettingsController.createHeroSection);
router.put('/hero-sections/:id', verifyFirebaseToken, isAdmin, siteSettingsController.updateHeroSection);
router.delete('/hero-sections/:id', verifyFirebaseToken, isAdmin, siteSettingsController.deleteHeroSection);

// Features management
router.post('/features', verifyFirebaseToken, isAdmin, siteSettingsController.createFeature);
router.put('/features/:id', verifyFirebaseToken, isAdmin, siteSettingsController.updateFeature);
router.delete('/features/:id', verifyFirebaseToken, isAdmin, siteSettingsController.deleteFeature);

// Navigation management
router.post('/navigation', verifyFirebaseToken, isAdmin, siteSettingsController.createNavigation);
router.put('/navigation/:id', verifyFirebaseToken, isAdmin, siteSettingsController.updateNavigation);
router.delete('/navigation/:id', verifyFirebaseToken, isAdmin, siteSettingsController.deleteNavigation);

export default router;
