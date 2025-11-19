import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '../config/firebase.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create payment order', message: error.message });
  }
};

// Verify Razorpay payment signature
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Create signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully

      // Update order payment status in Firestore
      if (orderId) {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: 'completed',
          paymentId: razorpay_payment_id,
          paymentDetails: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          },
          orderStatus: 'confirmed',
          updatedAt: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      // Invalid signature
      if (orderId) {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: 'failed',
          updatedAt: new Date().toISOString()
        });
      }

      res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed', message: error.message });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Failed to fetch payment details', message: error.message });
  }
};

// Initiate refund
export const initiateRefund = async (req, res) => {
  try {
    const { paymentId, amount, notes } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // amount in paise
      notes: notes || {}
    });

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      refund
    });
  } catch (error) {
    console.error('Error initiating refund:', error);
    res.status(500).json({ error: 'Failed to initiate refund', message: error.message });
  }
};

// Create payment for services/appointments
export const createServicePayment = async (req, res) => {
  try {
    const { appointmentId, amount, description } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      payment_capture: 1,
      notes: {
        appointmentId,
        description
      }
    };

    const order = await razorpay.orders.create(options);

    // Update appointment with payment order ID
    await db.collection('appointments').doc(appointmentId).update({
      paymentOrderId: order.id,
      paymentStatus: 'pending',
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating service payment:', error);
    res.status(500).json({ error: 'Failed to create payment', message: error.message });
  }
};

// Verify service payment
export const verifyServicePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update appointment payment status
      await db.collection('appointments').doc(appointmentId).update({
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        status: 'confirmed',
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified and appointment confirmed'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying service payment:', error);
    res.status(500).json({ error: 'Payment verification failed', message: error.message });
  }
};
