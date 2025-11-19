const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input type="text" className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="input-field" placeholder="+91 1234567890" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input-field" rows="5" placeholder="Your message"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-2">📍 Address</h3>
            <p>123 Pet Street, Mumbai, Maharashtra 400001</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📞 Phone</h3>
            <p>+91 1234567890</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📧 Email</h3>
            <p>info@petservices.com</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">💬 WhatsApp</h3>
            <a href="https://wa.me/911234567890" className="text-primary-600 hover:underline">Chat on WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
