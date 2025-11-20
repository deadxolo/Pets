import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [settings, setSettings] = useState({
    phone: '+91 1234567890',
    email: 'info@petservices.com',
    address: '123 Pet Street, Mumbai, Maharashtra 400001',
    whatsapp: '+91 1234567890'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/site/settings');
      if (res.data.success && res.data.data) {
        setSettings({
          phone: res.data.data.phone || '+91 1234567890',
          email: res.data.data.email || 'info@petservices.com',
          address: res.data.data.address || '123 Pet Street, Mumbai, Maharashtra 400001',
          whatsapp: res.data.data.whatsapp || '+91 1234567890'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/contact/submit', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+91 1234567890"
                required
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-field"
                rows="5"
                placeholder="Your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-2">📍 Address</h3>
            <p>{settings.address}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📞 Phone</h3>
            <p>{settings.phone}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📧 Email</h3>
            <p>{settings.email}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">💬 WhatsApp</h3>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              className="text-primary-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
