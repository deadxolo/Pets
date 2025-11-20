import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaCog, FaImages, FaNewspaper, FaBox, FaShoppingCart,
  FaCalendarAlt, FaUsers, FaBookmark, FaSignOutAlt, FaBars, FaTimes,
  FaChartLine, FaEnvelope
} from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { path: '/admin', icon: <FaChartLine />, label: 'Dashboard', exact: true },
    { path: '/admin/content', icon: <FaHome />, label: 'Content Management' },
    { path: '/admin/services', icon: <FaCog />, label: 'Services' },
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/articles', icon: <FaNewspaper />, label: 'Articles' },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/admin/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
    { path: '/admin/bookings', icon: <FaBookmark />, label: 'Bookings' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/contacts', icon: <FaEnvelope />, label: 'Contact Submissions' },
    { path: '/admin/media', icon: <FaImages />, label: 'Media Library' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-800"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-gray-800 border-l-4 border-blue-500'
                  : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-800 p-4">
          {sidebarOpen && (
            <div className="mb-2">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold truncate">{user?.phoneNumber || user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2 rounded hover:bg-gray-800 transition-colors text-red-400"
          >
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {menuItems.find((item) => isActive(item.path, item.exact))?.label || 'Admin'}
          </h2>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Site
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
