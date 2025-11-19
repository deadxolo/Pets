import { db } from '../config/firebase.js';
import { sendEmail } from '../utils/emailService.js';

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('contacts').add(contactData);

    // Send confirmation email to user
    if (contactData.email) {
      await sendEmail({
        to: contactData.email,
        subject: 'Thank you for contacting us',
        template: 'contactConfirmation',
        data: contactData
      });
    }

    // Send notification to admin
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      template: 'adminContactNotification',
      data: { contactId: docRef.id, ...contactData }
    });

    res.status(201).json({
      message: 'Contact form submitted successfully. We will get back to you soon!',
      contactId: docRef.id
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form', message: error.message });
  }
};

// Get all contact submissions (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;
    let contactsRef = db.collection('contacts');

    if (status) {
      contactsRef = contactsRef.where('status', '==', status);
    }

    const snapshot = await contactsRef.orderBy('createdAt', 'desc').get();
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts', message: error.message });
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (response) {
      updates.response = response;
    }

    await db.collection('contacts').doc(id).update(updates);

    res.status(200).json({
      message: 'Contact status updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact', message: error.message });
  }
};

// Get contact information (for display on contact page)
export const getContactInfo = async (req, res) => {
  try {
    const contactInfo = {
      phone: '+91 1234567890',
      whatsapp: '+91 1234567890',
      email: 'info@petservices.com',
      address: {
        street: '123 Pet Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      location: {
        lat: 19.0760,
        lng: 72.8777
      },
      hours: {
        weekdays: '9:00 AM - 8:00 PM',
        weekends: '10:00 AM - 6:00 PM',
        holidays: 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/petservices',
        instagram: 'https://instagram.com/petservices',
        twitter: 'https://twitter.com/petservices'
      }
    };

    res.status(200).json({ contactInfo });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ error: 'Failed to fetch contact info', message: error.message });
  }
};
