import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    { id: 1, name: 'Medical Services', price: '₹500-2000', description: 'Comprehensive medical care for your pets' },
    { id: 2, name: 'Grooming', price: '₹300-1000', description: 'Professional grooming services' },
    { id: 3, name: 'Veterinary Services', price: '₹1000-5000', description: 'Expert veterinary care' },
    { id: 4, name: 'Pet Daycare', price: '₹500/day', description: 'Safe and fun daycare' },
    { id: 5, name: 'Pet Training', price: '₹2000-10000', description: 'Professional training programs' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.id} className="card">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-primary-600 font-bold mb-4">{service.price}</p>
            <Link to="/appointments" className="btn-primary w-full text-center block">
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
