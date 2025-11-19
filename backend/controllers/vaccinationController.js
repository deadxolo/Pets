import { db } from '../config/firebase.js';
import { sendWhatsAppMessage } from '../utils/whatsappService.js';

// Add vaccination record
export const addVaccinationRecord = async (req, res) => {
  try {
    const uid = req.user.uid;
    const vaccinationData = {
      userId: uid,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('vaccinations').add(vaccinationData);

    // Send reminder for next vaccination if nextDueDate is provided
    if (vaccinationData.nextDueDate) {
      const userDoc = await db.collection('users').doc(uid).get();
      const userData = userDoc.data();

      if (userData.phoneNumber) {
        await sendWhatsAppMessage({
          to: userData.phoneNumber,
          message: `Vaccination record added for ${vaccinationData.petName}. Next vaccination due on: ${vaccinationData.nextDueDate}`
        });
      }
    }

    res.status(201).json({
      message: 'Vaccination record added successfully',
      vaccination: { id: docRef.id, ...vaccinationData }
    });
  } catch (error) {
    console.error('Error adding vaccination record:', error);
    res.status(500).json({ error: 'Failed to add vaccination record', message: error.message });
  }
};

// Get user's vaccination records
export const getUserVaccinations = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { petId } = req.query;

    let vaccinationsRef = db.collection('vaccinations').where('userId', '==', uid);

    if (petId) {
      vaccinationsRef = vaccinationsRef.where('petId', '==', petId);
    }

    const snapshot = await vaccinationsRef.orderBy('vaccinationDate', 'desc').get();
    const vaccinations = [];
    snapshot.forEach(doc => {
      vaccinations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ vaccinations });
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({ error: 'Failed to fetch vaccinations', message: error.message });
  }
};

// Get all vaccination records (Admin only)
export const getAllVaccinations = async (req, res) => {
  try {
    const snapshot = await db.collection('vaccinations')
      .orderBy('vaccinationDate', 'desc')
      .get();

    const vaccinations = [];
    snapshot.forEach(doc => {
      vaccinations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ vaccinations });
  } catch (error) {
    console.error('Error fetching all vaccinations:', error);
    res.status(500).json({ error: 'Failed to fetch vaccinations', message: error.message });
  }
};

// Update vaccination record
export const updateVaccinationRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const vaccinationDoc = await db.collection('vaccinations').doc(id).get();
    if (!vaccinationDoc.exists) {
      return res.status(404).json({ error: 'Vaccination record not found' });
    }

    const vaccination = vaccinationDoc.data();
    if (vaccination.userId !== uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    delete updates.userId;
    delete updates.createdAt;

    await db.collection('vaccinations').doc(id).update(updates);

    const updatedDoc = await db.collection('vaccinations').doc(id).get();
    res.status(200).json({
      message: 'Vaccination record updated successfully',
      vaccination: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    console.error('Error updating vaccination record:', error);
    res.status(500).json({ error: 'Failed to update vaccination record', message: error.message });
  }
};

// Delete vaccination record
export const deleteVaccinationRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const vaccinationDoc = await db.collection('vaccinations').doc(id).get();
    if (!vaccinationDoc.exists) {
      return res.status(404).json({ error: 'Vaccination record not found' });
    }

    const vaccination = vaccinationDoc.data();
    if (vaccination.userId !== uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await db.collection('vaccinations').doc(id).delete();

    res.status(200).json({ message: 'Vaccination record deleted successfully' });
  } catch (error) {
    console.error('Error deleting vaccination record:', error);
    res.status(500).json({ error: 'Failed to delete vaccination record', message: error.message });
  }
};

// Get upcoming vaccinations (due soon)
export const getUpcomingVaccinations = async (req, res) => {
  try {
    const uid = req.user.uid;
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const snapshot = await db.collection('vaccinations')
      .where('userId', '==', uid)
      .where('nextDueDate', '>=', today)
      .where('nextDueDate', '<=', thirtyDaysLater)
      .get();

    const upcomingVaccinations = [];
    snapshot.forEach(doc => {
      upcomingVaccinations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ upcomingVaccinations });
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming vaccinations', message: error.message });
  }
};

// Get vaccination schedule/requirements
export const getVaccinationSchedule = async (req, res) => {
  try {
    const { petType } = req.query;

    const schedules = {
      dog: [
        { name: 'DHPP', age: '6-8 weeks', description: 'Distemper, Hepatitis, Parainfluenza, Parvovirus' },
        { name: 'DHPP Booster', age: '10-12 weeks', description: 'Second dose' },
        { name: 'DHPP Booster', age: '14-16 weeks', description: 'Third dose' },
        { name: 'Rabies', age: '12-16 weeks', description: 'Rabies vaccination' },
        { name: 'DHPP Annual', age: 'Every year', description: 'Annual booster' },
        { name: 'Rabies Booster', age: 'Every 1-3 years', description: 'As per local regulations' }
      ],
      cat: [
        { name: 'FVRCP', age: '6-8 weeks', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia' },
        { name: 'FVRCP Booster', age: '10-12 weeks', description: 'Second dose' },
        { name: 'FVRCP Booster', age: '14-16 weeks', description: 'Third dose' },
        { name: 'Rabies', age: '12-16 weeks', description: 'Rabies vaccination' },
        { name: 'FVRCP Annual', age: 'Every year', description: 'Annual booster' },
        { name: 'FeLV', age: '8-12 weeks', description: 'Feline Leukemia (if at risk)' }
      ]
    };

    if (petType && schedules[petType.toLowerCase()]) {
      res.status(200).json({ schedule: schedules[petType.toLowerCase()] });
    } else {
      res.status(200).json({ schedules });
    }
  } catch (error) {
    console.error('Error fetching vaccination schedule:', error);
    res.status(500).json({ error: 'Failed to fetch vaccination schedule', message: error.message });
  }
};
