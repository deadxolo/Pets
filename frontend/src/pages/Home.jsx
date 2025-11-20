import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHospital, FaCut, FaHome, FaGraduationCap, FaShoppingCart, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
  const [heroSections, setHeroSections] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback services if database is not set up yet
  const defaultServices = [
    { icon: <FaHospital />, title: 'Medical Services', desc: 'Expert veterinary care', link: '/services' },
    { icon: <FaCut />, title: 'Grooming', desc: 'Professional grooming services', link: '/bookings' },
    { icon: <FaHome />, title: 'Pet Daycare', desc: 'Safe and fun daycare', link: '/bookings' },
    { icon: <FaGraduationCap />, title: 'Training', desc: 'Professional pet training', link: '/bookings' },
    { icon: <FaShoppingCart />, title: 'Pet Products', desc: 'Quality pet supplies', link: '/products' },
    { icon: <FaCalendarAlt />, title: 'Appointments', desc: 'Easy online booking', link: '/appointments' }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [heroRes, featuresRes] = await Promise.all([
        axios.get('/api/site/hero-sections').catch(() => ({ data: { data: [] } })),
        axios.get('/api/site/features').catch(() => ({ data: { data: [] } }))
      ]);

      setHeroSections(heroRes.data.data || []);
      setFeatures(featuresRes.data.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use first hero section or fallback to default
  const mainHero = heroSections.length > 0 ? heroSections[0] : {
    title: 'Complete Pet Care Solution',
    subtitle: '',
    description: 'Medical services, grooming, training, and quality products for your beloved pets',
    buttonText: 'Our Services',
    buttonLink: '/services'
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {mainHero.subtitle && <p className="text-lg mb-2">{mainHero.subtitle}</p>}
          <h1 className="text-5xl font-bold mb-6">{mainHero.title}</h1>
          <p className="text-xl mb-8">{mainHero.description}</p>
          <div className="flex justify-center space-x-4">
            <Link to={mainHero.buttonLink || '/services'} className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {mainHero.buttonText || 'Our Services'}
            </Link>
            <Link to="/products" className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Shop Products
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultServices.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="card text-center group hover:shadow-xl"
              >
                <div className="text-5xl text-primary-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.length > 0 ? (
              features.map((feature) => (
                <div key={feature.id} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
                  <p className="text-gray-600">Certified professionals with years of experience</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                  <p className="text-gray-600">Book appointments online with instant confirmation</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">Affordable Prices</h3>
                  <p className="text-gray-600">Quality services at competitive prices</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Book your appointment today and give your pet the care they deserve</p>
          <Link to="/appointments" className="btn-primary text-lg px-10 py-4">
            Book Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
