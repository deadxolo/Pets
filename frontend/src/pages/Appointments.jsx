const Appointments = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Book an Appointment</h1>
      <div className="max-w-2xl mx-auto card">
        <form className="space-y-4">
          <div>
            <label className="label">Service Type</label>
            <select className="input-field">
              <option>Medical Consultation</option>
              <option>Veterinary Services</option>
              <option>Vaccination</option>
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
            <label className="label">Notes</label>
            <textarea className="input-field" rows="3" placeholder="Any specific concerns?"></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">Book Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default Appointments;
