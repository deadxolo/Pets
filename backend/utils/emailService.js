import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const templates = {
  appointmentConfirmation: (data) => `
    <h2>Appointment Confirmation</h2>
    <p>Dear Customer,</p>
    <p>Your appointment has been confirmed!</p>
    <h3>Appointment Details:</h3>
    <ul>
      <li><strong>Service:</strong> ${data.serviceType}</li>
      <li><strong>Date:</strong> ${data.date}</li>
      <li><strong>Time:</strong> ${data.time}</li>
      <li><strong>Pet:</strong> ${data.petName || 'N/A'}</li>
    </ul>
    <p>Please arrive 10 minutes before your scheduled time.</p>
    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    <p>Thank you for choosing our services!</p>
    <p>Best regards,<br>Pet Services Team</p>
  `,

  orderConfirmation: (data) => `
    <h2>Order Confirmation</h2>
    <p>Dear Customer,</p>
    <p>Thank you for your order!</p>
    <h3>Order Details:</h3>
    <ul>
      <li><strong>Order ID:</strong> ${data.orderId}</li>
      <li><strong>Total Amount:</strong> ₹${data.totalAmount}</li>
      <li><strong>Payment Status:</strong> ${data.paymentStatus}</li>
    </ul>
    <h4>Items:</h4>
    <ul>
      ${data.items.map(item => `<li>${item.name} - Quantity: ${item.quantity} - ₹${item.price}</li>`).join('')}
    </ul>
    <h4>Shipping Address:</h4>
    <p>${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}</p>
    <p>We'll send you a shipping confirmation once your order is on its way!</p>
    <p>Best regards,<br>Pet Services Team</p>
  `,

  bookingConfirmation: (data) => `
    <h2>Booking Confirmation</h2>
    <p>Dear Customer,</p>
    <p>Your booking has been confirmed!</p>
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking ID:</strong> ${data.bookingId}</li>
      <li><strong>Service:</strong> ${data.serviceType}</li>
      <li><strong>Date:</strong> ${data.date}</li>
      <li><strong>Time:</strong> ${data.time}</li>
      <li><strong>Duration:</strong> ${data.duration || 'N/A'}</li>
    </ul>
    <p>We look forward to serving you and your pet!</p>
    <p>Best regards,<br>Pet Services Team</p>
  `,

  contactConfirmation: (data) => `
    <h2>Thank You for Contacting Us</h2>
    <p>Dear ${data.name},</p>
    <p>We have received your message and will get back to you within 24 hours.</p>
    <h3>Your Message:</h3>
    <p>${data.message}</p>
    <p>If you need immediate assistance, please call us at +91 1234567890.</p>
    <p>Best regards,<br>Pet Services Team</p>
  `,

  adminContactNotification: (data) => `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
    <p><strong>Submitted At:</strong> ${data.createdAt}</p>
  `
};

// Send email function
export const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const htmlContent = templates[template] ? templates[template](data) : data.html || '<p>No content</p>';

    const mailOptions = {
      from: `"Pet Services" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email transporter is ready');
    return true;
  } catch (error) {
    console.error('Email transporter error:', error);
    return false;
  }
};

export default { sendEmail, verifyEmailConfig };
