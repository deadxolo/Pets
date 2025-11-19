import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaw } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaPaw className="text-primary-500 text-2xl" />
              <h3 className="text-white text-xl font-bold">PetCare</h3>
            </div>
            <p className="text-sm mb-4">
              Your complete pet care solution. We provide medical services, grooming, training,
              and quality products for your beloved pets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-primary-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-500 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/consultant" className="hover:text-primary-500 transition-colors">
                  Consultant
                </Link>
              </li>
              <li>
                <Link to="/vaccination" className="hover:text-primary-500 transition-colors">
                  Vaccination
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>Medical Services</li>
              <li>Grooming</li>
              <li>Veterinary Services</li>
              <li>Pet Daycare</li>
              <li>Training</li>
              <li>Pet Products</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-500 mt-1" />
                <span className="text-sm">123 Pet Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-500" />
                <span className="text-sm">+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaWhatsapp className="text-primary-500" />
                <span className="text-sm">+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-500" />
                <span className="text-sm">info@petservices.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
