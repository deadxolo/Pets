import { db } from '../config/firebase.js';

// Get all site settings
export const getAllSettings = async (req, res) => {
  try {
    const settingsDoc = await db.collection('site_settings').doc('general').get();

    if (!settingsDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Site settings not found'
      });
    }

    res.json({
      success: true,
      data: settingsDoc.data()
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message
    });
  }
};

// Update site settings
export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    await db.collection('site_settings').doc('general').set(updates, { merge: true });

    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: updates
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: error.message
    });
  }
};

// Get hero sections
export const getHeroSections = async (req, res) => {
  try {
    const heroSnapshot = await db.collection('hero_sections')
      .where('active', '==', true)
      .orderBy('order', 'asc')
      .get();

    const heroSections = [];
    heroSnapshot.forEach(doc => {
      heroSections.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: heroSections
    });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero sections',
      error: error.message
    });
  }
};

// Create hero section
export const createHeroSection = async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink, image, active, order } = req.body;

    const heroData = {
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      image: image || '',
      active: active !== undefined ? active : true,
      order: order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('hero_sections').add(heroData);

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: { id: docRef.id, ...heroData }
    });
  } catch (error) {
    console.error('Error creating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hero section',
      error: error.message
    });
  }
};

// Update hero section
export const updateHeroSection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('hero_sections').doc(id).update(updates);

    res.json({
      success: true,
      message: 'Hero section updated successfully',
      data: { id, ...updates }
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero section',
      error: error.message
    });
  }
};

// Delete hero section
export const deleteHeroSection = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('hero_sections').doc(id).delete();

    res.json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hero section',
      error: error.message
    });
  }
};

// Get features
export const getFeatures = async (req, res) => {
  try {
    const featuresSnapshot = await db.collection('features')
      .where('active', '==', true)
      .orderBy('order', 'asc')
      .get();

    const features = [];
    featuresSnapshot.forEach(doc => {
      features.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch features',
      error: error.message
    });
  }
};

// Create feature
export const createFeature = async (req, res) => {
  try {
    const { title, description, icon, active, order } = req.body;

    const featureData = {
      title,
      description,
      icon: icon || '',
      active: active !== undefined ? active : true,
      order: order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('features').add(featureData);

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      data: { id: docRef.id, ...featureData }
    });
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feature',
      error: error.message
    });
  }
};

// Update feature
export const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('features').doc(id).update(updates);

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: { id, ...updates }
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feature',
      error: error.message
    });
  }
};

// Delete feature
export const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('features').doc(id).delete();

    res.json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feature',
      error: error.message
    });
  }
};

// Get navigation items
export const getNavigation = async (req, res) => {
  try {
    const navSnapshot = await db.collection('navigation')
      .where('active', '==', true)
      .orderBy('order', 'asc')
      .get();

    const navigation = [];
    navSnapshot.forEach(doc => {
      navigation.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: navigation
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch navigation',
      error: error.message
    });
  }
};

// Create navigation item
export const createNavigation = async (req, res) => {
  try {
    const { name, path, icon, active, order } = req.body;

    const navData = {
      name,
      path,
      icon: icon || '',
      active: active !== undefined ? active : true,
      order: order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('navigation').add(navData);

    res.status(201).json({
      success: true,
      message: 'Navigation item created successfully',
      data: { id: docRef.id, ...navData }
    });
  } catch (error) {
    console.error('Error creating navigation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create navigation',
      error: error.message
    });
  }
};

// Update navigation item
export const updateNavigation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('navigation').doc(id).update(updates);

    res.json({
      success: true,
      message: 'Navigation item updated successfully',
      data: { id, ...updates }
    });
  } catch (error) {
    console.error('Error updating navigation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update navigation',
      error: error.message
    });
  }
};

// Delete navigation item
export const deleteNavigation = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('navigation').doc(id).delete();

    res.json({
      success: true,
      message: 'Navigation item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting navigation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete navigation',
      error: error.message
    });
  }
};
