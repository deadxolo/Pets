import dotenv from 'dotenv';

dotenv.config();

// Note: Twilio is commented out for now. Uncomment when you have Twilio credentials
// import twilio from 'twilio';
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send WhatsApp message
export const sendWhatsAppMessage = async ({ to, message }) => {
  try {
    // For development/demo purposes, just log the message
    console.log('📱 WhatsApp Message:');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('---');

    // Uncomment below when you have Twilio credentials configured
    /*
    const result = await client.messages.create({
      body: message,
      from: process.env.WHATSAPP_BUSINESS_NUMBER,
      to: `whatsapp:${to}`
    });

    console.log('WhatsApp message sent:', result.sid);
    return result;
    */

    return { success: true, message: 'Message logged (Twilio not configured)' };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

// Send WhatsApp template message
export const sendWhatsAppTemplate = async ({ to, templateName, templateData }) => {
  try {
    console.log('📱 WhatsApp Template Message:');
    console.log(`To: ${to}`);
    console.log(`Template: ${templateName}`);
    console.log(`Data:`, templateData);
    console.log('---');

    // Uncomment below when you have Twilio credentials and templates configured
    /*
    const result = await client.messages.create({
      contentSid: templateName,
      contentVariables: JSON.stringify(templateData),
      from: process.env.WHATSAPP_BUSINESS_NUMBER,
      to: `whatsapp:${to}`
    });

    console.log('WhatsApp template sent:', result.sid);
    return result;
    */

    return { success: true, message: 'Template logged (Twilio not configured)' };
  } catch (error) {
    console.error('Error sending WhatsApp template:', error);
    throw error;
  }
};

// Send bulk WhatsApp messages
export const sendBulkWhatsAppMessages = async (messages) => {
  try {
    const results = [];

    for (const msg of messages) {
      const result = await sendWhatsAppMessage(msg);
      results.push(result);
      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  } catch (error) {
    console.error('Error sending bulk WhatsApp messages:', error);
    throw error;
  }
};

// Send appointment reminder
export const sendAppointmentReminder = async (appointment, userPhone) => {
  const message = `
🐾 Appointment Reminder

Hello! This is a reminder about your upcoming appointment:

📅 Date: ${appointment.date}
⏰ Time: ${appointment.time}
🏥 Service: ${appointment.serviceType}
🐕 Pet: ${appointment.petName || 'Your pet'}

Please arrive 10 minutes early. If you need to reschedule, please contact us at least 24 hours in advance.

See you soon! 🐾
  `.trim();

  return sendWhatsAppMessage({ to: userPhone, message });
};

// Send order status update
export const sendOrderStatusUpdate = async (orderId, status, userPhone, trackingNumber = null) => {
  let message = `
📦 Order Update

Your order #${orderId} status has been updated to: ${status.toUpperCase()}
`;

  if (trackingNumber) {
    message += `\n🚚 Tracking Number: ${trackingNumber}`;
  }

  message += `\n\nThank you for shopping with us! 🐾`;

  return sendWhatsAppMessage({ to: userPhone, message: message.trim() });
};

export default {
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  sendBulkWhatsAppMessages,
  sendAppointmentReminder,
  sendOrderStatusUpdate
};
