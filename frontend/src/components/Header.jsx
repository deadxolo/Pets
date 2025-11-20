import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaPaw, FaUserShield } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser, signOut } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdTokenResult();
          setIsAdmin(token.claims.admin === true);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Consultant', path: '/consultant' },
    { name: 'Vaccination', path: '/vaccination' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaPaw className="text-primary-600 text-3xl" />
            <span className="text-2xl font-bold text-primary-600">PetCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin Button - Only visible to admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <FaUserShield className="text-lg" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:text-primary-600 transition-colors">
              <FaShoppingCart className="text-2xl" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:text-primary-600 transition-colors">
                  <FaUser className="text-xl" />
                  <span className="font-medium">Account</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  {isAdmin && (
                    <>
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-purple-600 font-semibold">
                        <FaUserShield className="inline mr-2" />
                        Admin Panel
                      </Link>
                      <div className="border-t my-2"></div>
                    </>
                  )}
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/my-orders" className="block px-4 py-2 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link to="/my-appointments" className="block px-4 py-2 hover:bg-gray-100">
                    My Appointments
                  </Link>
                  <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 text-gray-700 hover:text-primary-600 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center"
              >
                Cart ({getCartCount()})
              </Link>
              {currentUser ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-purple-600 hover:text-purple-700 font-bold flex items-center"
                    >
                      <FaUserShield className="inline mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 text-gray-700 hover:text-primary-600 font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="py-2 text-left text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 text-gray-700 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
