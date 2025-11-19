import { db } from '../config/firebase.js';
import { sendEmail } from '../utils/emailService.js';
import { sendWhatsAppMessage } from '../utils/whatsappService.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    // Validate items and check stock
    for (const item of items) {
      const productDoc = await db.collection('products').doc(item.productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      const product = productDoc.data();
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
    }

    const orderData = {
      userId: uid,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('orders').add(orderData);

    // Update product stock
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      const currentStock = productDoc.data().stock;
      await productRef.update({
        stock: currentStock - item.quantity,
        updatedAt: new Date().toISOString()
      });
    }

    // Get user details for notification
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Send order confirmation
    if (userData.profile?.email) {
      await sendEmail({
        to: userData.profile.email,
        subject: 'Order Confirmation',
        template: 'orderConfirmation',
        data: { orderId: docRef.id, ...orderData }
      });
    }

    if (userData.phoneNumber) {
      await sendWhatsAppMessage({
        to: userData.phoneNumber,
        message: `Your order #${docRef.id} has been placed successfully! Total: ₹${totalAmount}. We'll send you updates as your order is processed.`
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: { id: docRef.id, ...orderData }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { status } = req.query;

    let ordersRef = db.collection('orders').where('userId', '==', uid);

    if (status) {
      ordersRef = ordersRef.where('orderStatus', '==', status);
    }

    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    let ordersRef = db.collection('orders');

    if (status) {
      ordersRef = ordersRef.where('orderStatus', '==', status);
    }
    if (paymentStatus) {
      ordersRef = ordersRef.where('paymentStatus', '==', paymentStatus);
    }

    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDoc = await db.collection('orders').doc(id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = { id: orderDoc.id, ...orderDoc.data() };

    // Check if user owns this order or is admin
    if (order.userId !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber } = req.body;

    const updates = {
      orderStatus,
      updatedAt: new Date().toISOString()
    };

    if (trackingNumber) {
      updates.trackingNumber = trackingNumber;
    }

    await db.collection('orders').doc(id).update(updates);

    // Get order and user details for notification
    const orderDoc = await db.collection('orders').doc(id).get();
    const order = orderDoc.data();
    const userDoc = await db.collection('users').doc(order.userId).get();
    const userData = userDoc.data();

    // Send status update notification
    if (userData.phoneNumber) {
      let message = `Your order #${id} status: ${orderStatus}`;
      if (trackingNumber) {
        message += `. Tracking: ${trackingNumber}`;
      }
      await sendWhatsAppMessage({
        to: userData.phoneNumber,
        message
      });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: { id, ...order, ...updates }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', message: error.message });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentId, paymentDetails } = req.body;

    const updates = {
      paymentStatus,
      updatedAt: new Date().toISOString()
    };

    if (paymentId) {
      updates.paymentId = paymentId;
    }
    if (paymentDetails) {
      updates.paymentDetails = paymentDetails;
    }

    await db.collection('orders').doc(id).update(updates);

    res.status(200).json({
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status', message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const orderDoc = await db.collection('orders').doc(id).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data();
    if (order.userId !== uid && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({ error: 'Cannot cancel shipped or delivered orders' });
    }

    // Restore product stock
    for (const item of order.items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        const currentStock = productDoc.data().stock;
        await productRef.update({
          stock: currentStock + item.quantity,
          updatedAt: new Date().toISOString()
        });
      }
    }

    await db.collection('orders').doc(id).update({
      orderStatus: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order', message: error.message });
  }
};
