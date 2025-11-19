const MyBookings = () => {
  const bookings = [
    { id: 'BKG001', service: 'Grooming', date: '2025-11-20', time: '11:00 AM', status: 'Confirmed' },
    { id: 'BKG002', service: 'Pet Daycare', date: '2025-11-23', time: '9:00 AM', status: 'Pending' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{booking.service}</h3>
                <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
