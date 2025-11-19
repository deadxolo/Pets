const Bookings = () => {
  const services = ['Grooming', 'Pet Daycare', 'Training'];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Book a Service</h1>
      <div className="max-w-2xl mx-auto card">
        <form className="space-y-4">
          <div>
            <label className="label">Service Type</label>
            <select className="input-field">
              {services.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Pet Name</label>
            <input type="text" className="input-field" placeholder="Your pet's name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Special Requests</label>
            <textarea className="input-field" rows="3"></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">Book Service</button>
        </form>
      </div>
    </div>
  );
};

export default Bookings;
