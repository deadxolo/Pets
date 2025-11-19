import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { addToCart } = useCart();
  const [category, setCategory] = useState('all');

  const products = [
    { id: 1, name: 'Premium Dog Food', price: 1200, category: 'food', image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Cat Toy Set', price: 500, category: 'toys', image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Pet Collar', price: 300, category: 'accessories', image: 'https://via.placeholder.com/200' },
    { id: 4, name: 'Pet Medicine', price: 800, category: 'medicine', image: 'https://via.placeholder.com/200' }
  ];

  const filteredProducts = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Pet Products</h1>

      {/* Category Filter */}
      <div className="flex justify-center space-x-4 mb-8">
        <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded ${category === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
          All
        </button>
        <button onClick={() => setCategory('food')} className={`px-4 py-2 rounded ${category === 'food' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
          Food
        </button>
        <button onClick={() => setCategory('toys')} className={`px-4 py-2 rounded ${category === 'toys' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
          Toys
        </button>
        <button onClick={() => setCategory('accessories')} className={`px-4 py-2 rounded ${category === 'accessories' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
          Accessories
        </button>
        <button onClick={() => setCategory('medicine')} className={`px-4 py-2 rounded ${category === 'medicine' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
          Medicine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-primary-600 font-bold mb-4">₹{product.price}</p>
            <button onClick={() => addToCart(product)} className="btn-primary w-full">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
