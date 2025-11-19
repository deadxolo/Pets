import { db } from '../config/firebase.js';

// Get all articles/tips
export const getAllArticles = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let articlesRef = db.collection('articles');

    if (category) {
      articlesRef = articlesRef.where('category', '==', category);
    }
    if (featured === 'true') {
      articlesRef = articlesRef.where('featured', '==', true);
    }

    const snapshot = await articlesRef.orderBy('createdAt', 'desc').get();
    const articles = [];
    snapshot.forEach(doc => {
      articles.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles', message: error.message });
  }
};

// Get article by ID
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const articleDoc = await db.collection('articles').doc(id).get();

    if (!articleDoc.exists) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    const currentViews = articleDoc.data().views || 0;
    await db.collection('articles').doc(id).update({
      views: currentViews + 1
    });

    res.status(200).json({ article: { id: articleDoc.id, ...articleDoc.data(), views: currentViews + 1 } });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article', message: error.message });
  }
};

// Create article (Admin only)
export const createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('articles').add(articleData);

    res.status(201).json({
      message: 'Article created successfully',
      article: { id: docRef.id, ...articleData }
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article', message: error.message });
  }
};

// Update article (Admin only)
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    delete updates.createdAt;
    delete updates.views;

    await db.collection('articles').doc(id).update(updates);

    const updatedDoc = await db.collection('articles').doc(id).get();
    res.status(200).json({
      message: 'Article updated successfully',
      article: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article', message: error.message });
  }
};

// Delete article (Admin only)
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('articles').doc(id).delete();

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article', message: error.message });
  }
};

// Get article categories
export const getArticleCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'health-tips', name: 'Pet Health Tips', icon: '🏥', description: 'Keep your pets healthy and happy' },
      { id: 'grooming', name: 'Grooming Advice', icon: '✂️', description: 'Professional grooming tips and tricks' },
      { id: 'training', name: 'Training Guidance', icon: '🎓', description: 'Effective training methods and techniques' },
      { id: 'seasonal-care', name: 'Seasonal Care', icon: '🌦️', description: 'Seasonal care tips for your pets' },
      { id: 'nutrition', name: 'Nutrition & Diet', icon: '🥗', description: 'Proper nutrition and diet plans' },
      { id: 'adoption', name: 'Adoption Guide', icon: '🏠', description: 'Everything about pet adoption' }
    ];

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
};

// Request consultation
export const requestConsultation = async (req, res) => {
  try {
    const uid = req.user.uid;
    const consultationData = {
      userId: uid,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('consultations').add(consultationData);

    res.status(201).json({
      message: 'Consultation request submitted successfully',
      consultation: { id: docRef.id, ...consultationData }
    });
  } catch (error) {
    console.error('Error requesting consultation:', error);
    res.status(500).json({ error: 'Failed to request consultation', message: error.message });
  }
};

// Get user consultations
export const getUserConsultations = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db.collection('consultations')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const consultations = [];
    snapshot.forEach(doc => {
      consultations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ consultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'Failed to fetch consultations', message: error.message });
  }
};

// Get all consultations (Admin only)
export const getAllConsultations = async (req, res) => {
  try {
    const { status } = req.query;
    let consultationsRef = db.collection('consultations');

    if (status) {
      consultationsRef = consultationsRef.where('status', '==', status);
    }

    const snapshot = await consultationsRef.orderBy('createdAt', 'desc').get();
    const consultations = [];
    snapshot.forEach(doc => {
      consultations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ consultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'Failed to fetch consultations', message: error.message });
  }
};

// Update consultation status (Admin only)
export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response, scheduledDate } = req.body;

    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (response) {
      updates.response = response;
    }
    if (scheduledDate) {
      updates.scheduledDate = scheduledDate;
    }

    await db.collection('consultations').doc(id).update(updates);

    res.status(200).json({
      message: 'Consultation updated successfully'
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ error: 'Failed to update consultation', message: error.message });
  }
};
