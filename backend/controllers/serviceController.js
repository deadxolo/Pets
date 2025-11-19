import { db } from '../config/firebase.js';

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { type, category } = req.query;
    let servicesRef = db.collection('services');

    if (type) {
      servicesRef = servicesRef.where('type', '==', type);
    }
    if (category) {
      servicesRef = servicesRef.where('category', '==', category);
    }

    const snapshot = await servicesRef.get();
    const services = [];
    snapshot.forEach(doc => {
      services.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services', message: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceDoc = await db.collection('services').doc(id).get();

    if (!serviceDoc.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ service: { id: serviceDoc.id, ...serviceDoc.data() } });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service', message: error.message });
  }
};

// Create new service (Admin only)
export const createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('services').add(serviceData);

    res.status(201).json({
      message: 'Service created successfully',
      service: { id: docRef.id, ...serviceData }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service', message: error.message });
  }
};

// Update service (Admin only)
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    delete updates.createdAt;

    await db.collection('services').doc(id).update(updates);

    const updatedDoc = await db.collection('services').doc(id).get();
    res.status(200).json({
      message: 'Service updated successfully',
      service: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service', message: error.message });
  }
};

// Delete service (Admin only)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('services').doc(id).delete();

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service', message: error.message });
  }
};

// Get medical service packages
export const getMedicalPackages = async (req, res) => {
  try {
    const packagesSnapshot = await db.collection('services')
      .where('category', '==', 'medical')
      .where('type', '==', 'package')
      .get();

    const packages = [];
    packagesSnapshot.forEach(doc => {
      packages.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ packages });
  } catch (error) {
    console.error('Error fetching medical packages:', error);
    res.status(500).json({ error: 'Failed to fetch medical packages', message: error.message });
  }
};
