const Vaccination = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Vaccination Tracker</h1>
      <div className="max-w-2xl mx-auto">
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add Vaccination Record</h2>
          <form className="space-y-4">
            <div>
              <label className="label">Pet Name</label>
              <input type="text" className="input-field" />
            </div>
            <div>
              <label className="label">Vaccine Name</label>
              <input type="text" className="input-field" placeholder="e.g., Rabies, DHPP" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date Given</label>
                <input type="date" className="input-field" />
              </div>
              <div>
                <label className="label">Next Due Date</label>
                <input type="date" className="input-field" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Add Record</button>
          </form>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Vaccination Schedule</h3>
          <p className="text-gray-600">View recommended vaccination schedules for dogs and cats.</p>
        </div>
      </div>
    </div>
  );
};

export default Vaccination;
