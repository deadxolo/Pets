import { db } from '../config/firebase.js';
import { sendEmail } from '../utils/emailService.js';
import { sendWhatsAppMessage } from '../utils/whatsappService.js';

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const uid = req.user.uid;
    const appointmentData = {
      userId: uid,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('appointments').add(appointmentData);

    // Get user details for notification
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Send confirmation email
    if (userData.profile?.email) {
      await sendEmail({
        to: userData.profile.email,
        subject: 'Appointment Confirmation',
        template: 'appointmentConfirmation',
        data: appointmentData
      });
    }

    // Send WhatsApp confirmation
    if (userData.phoneNumber) {
      await sendWhatsAppMessage({
        to: userData.phoneNumber,
        message: `Hi ${userData.profile?.name || 'there'}! Your appointment for ${appointmentData.serviceType} on ${appointmentData.date} at ${appointmentData.time} has been confirmed. Appointment ID: ${docRef.id}`
      });
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: { id: docRef.id, ...appointmentData }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment', message: error.message });
  }
};

// Get user appointments
export const getUserAppointments = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { status } = req.query;

    let appointmentsRef = db.collection('appointments').where('userId', '==', uid);

    if (status) {
      appointmentsRef = appointmentsRef.where('status', '==', status);
    }

    const snapshot = await appointmentsRef.orderBy('createdAt', 'desc').get();
    const appointments = [];
    snapshot.forEach(doc => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments', message: error.message });
  }
};

// Get all appointments (Admin only)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    let appointmentsRef = db.collection('appointments');

    if (status) {
      appointmentsRef = appointmentsRef.where('status', '==', status);
    }
    if (date) {
      appointmentsRef = appointmentsRef.where('date', '==', date);
    }

    const snapshot = await appointmentsRef.orderBy('createdAt', 'desc').get();
    const appointments = [];
    snapshot.forEach(doc => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments', message: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentDoc = await db.collection('appointments').doc(id).get();

    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = { id: appointmentDoc.id, ...appointmentDoc.data() };

    // Check if user owns this appointment or is admin
    if (appointment.userId !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment', message: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (notes) {
      updates.adminNotes = notes;
    }

    await db.collection('appointments').doc(id).update(updates);

    // Get appointment and user details for notification
    const appointmentDoc = await db.collection('appointments').doc(id).get();
    const appointment = appointmentDoc.data();
    const userDoc = await db.collection('users').doc(appointment.userId).get();
    const userData = userDoc.data();

    // Send notification about status update
    if (userData.phoneNumber) {
      await sendWhatsAppMessage({
        to: userData.phoneNumber,
        message: `Your appointment (ID: ${id}) status has been updated to: ${status}`
      });
    }

    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment: { id, ...appointment, ...updates }
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment', message: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const appointmentDoc = await db.collection('appointments').doc(id).get();
    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = appointmentDoc.data();
    if (appointment.userId !== uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await db.collection('appointments').doc(id).update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment', message: error.message });
  }
};

// Get available time slots
export const getAvailableSlots = async (req, res) => {
  try {
    const { date, serviceType } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Get all appointments for the date
    const appointmentsSnapshot = await db.collection('appointments')
      .where('date', '==', date)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    const bookedSlots = [];
    appointmentsSnapshot.forEach(doc => {
      bookedSlots.push(doc.data().time);
    });

    // Define available time slots (9 AM to 6 PM, 1-hour intervals)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ availableSlots, bookedSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots', message: error.message });
  }
};
