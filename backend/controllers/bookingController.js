import { db } from '../config/firebase.js';
import { sendEmail } from '../utils/emailService.js';
import { sendWhatsAppMessage } from '../utils/whatsappService.js';

// Create booking for services (grooming, daycare, training)
export const createBooking = async (req, res) => {
  try {
    const uid = req.user.uid;
    const bookingData = {
      userId: uid,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate required fields
    if (!bookingData.serviceType || !bookingData.date || !bookingData.time) {
      return res.status(400).json({
        error: 'Missing required fields: serviceType, date, time'
      });
    }

    const docRef = await db.collection('bookings').add(bookingData);

    // Get user details
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Send confirmations
    if (userData.profile?.email) {
      await sendEmail({
        to: userData.profile.email,
        subject: `Booking Confirmation - ${bookingData.serviceType}`,
        template: 'bookingConfirmation',
        data: { bookingId: docRef.id, ...bookingData }
      });
    }

    if (userData.phoneNumber) {
      await sendWhatsAppMessage({
        to: userData.phoneNumber,
        message: `Hi! Your booking for ${bookingData.serviceType} on ${bookingData.date} at ${bookingData.time} is confirmed. Booking ID: ${docRef.id}`
      });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: { id: docRef.id, ...bookingData }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', message: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { status, serviceType } = req.query;

    let bookingsRef = db.collection('bookings').where('userId', '==', uid);

    if (status) {
      bookingsRef = bookingsRef.where('status', '==', status);
    }
    if (serviceType) {
      bookingsRef = bookingsRef.where('serviceType', '==', serviceType);
    }

    const snapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
    const bookings = [];
    snapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const { status, date, serviceType } = req.query;
    let bookingsRef = db.collection('bookings');

    if (status) {
      bookingsRef = bookingsRef.where('status', '==', status);
    }
    if (date) {
      bookingsRef = bookingsRef.where('date', '==', date);
    }
    if (serviceType) {
      bookingsRef = bookingsRef.where('serviceType', '==', serviceType);
    }

    const snapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
    const bookings = [];
    snapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (notes) {
      updates.notes = notes;
    }

    await db.collection('bookings').doc(id).update(updates);

    res.status(200).json({
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const bookingDoc = await db.collection('bookings').doc(id).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingDoc.data();
    if (booking.userId !== uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await db.collection('bookings').doc(id).update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking', message: error.message });
  }
};

// Get available slots for bookings
export const getBookingSlots = async (req, res) => {
  try {
    const { date, serviceType } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    let bookingsRef = db.collection('bookings')
      .where('date', '==', date)
      .where('status', 'in', ['pending', 'confirmed']);

    if (serviceType) {
      bookingsRef = bookingsRef.where('serviceType', '==', serviceType);
    }

    const snapshot = await bookingsRef.get();
    const bookedSlots = [];
    snapshot.forEach(doc => {
      bookedSlots.push(doc.data().time);
    });

    // Available slots based on service type
    let allSlots = [];
    if (serviceType === 'grooming' || serviceType === 'training') {
      allSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    } else if (serviceType === 'daycare') {
      allSlots = ['08:00', '09:00', '10:00']; // Drop-off times
    } else {
      allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    }

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ availableSlots, bookedSlots });
  } catch (error) {
    console.error('Error fetching booking slots:', error);
    res.status(500).json({ error: 'Failed to fetch booking slots', message: error.message });
  }
};
