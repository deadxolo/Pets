const MyAppointments = () => {
  const appointments = [
    { id: 'APT001', service: 'Medical Consultation', date: '2025-11-22', time: '10:00 AM', status: 'Confirmed' },
    { id: 'APT002', service: 'Vaccination', date: '2025-11-25', time: '2:00 PM', status: 'Pending' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Appointments</h1>
      <div className="space-y-4">
        {appointments.map(apt => (
          <div key={apt.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{apt.service}</h3>
                <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
