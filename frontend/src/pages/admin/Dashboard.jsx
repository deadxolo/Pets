import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaCalendarAlt, FaUsers, FaRupeeSign, FaBookmark } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalAppointments: 0,
    totalUsers: 0,
    totalBookings: 0,
    recentOrders: [],
    recentAppointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await axios.get('/api/orders');
      const orders = ordersRes.data.data || [];

      // Fetch appointments
      const appointmentsRes = await axios.get('/api/appointments');
      const appointments = appointmentsRes.data.data || [];

      // Fetch bookings
      const bookingsRes = await axios.get('/api/booking');
      const bookings = bookingsRes.data.data || [];

      // Calculate stats
      const totalRevenue = orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const recentOrders = orders.slice(0, 5);
      const recentAppointments = appointments.slice(0, 5);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalAppointments: appointments.length,
        totalBookings: bookings.length,
        totalUsers: 0, // We'll need to add a users endpoint
        recentOrders,
        recentAppointments,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FaShoppingCart className="text-4xl" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <FaRupeeSign className="text-4xl" />,
      color: 'bg-green-500',
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      icon: <FaCalendarAlt className="text-4xl" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      icon: <FaBookmark className="text-4xl" />,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-4 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
          {stats.recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appointment.serviceType || 'Medical Service'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(appointment.date)} at {appointment.timeSlot}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
