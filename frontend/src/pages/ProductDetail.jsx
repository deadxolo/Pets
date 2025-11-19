import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = {
    id,
    name: 'Sample Product',
    price: 1200,
    description: 'This is a detailed description of the product.',
    image: 'https://via.placeholder.com/400'
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <img src={product.image} alt={product.name} className="w-full rounded-lg" />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-primary-600 font-bold mb-6">₹{product.price}</p>
          <p className="text-gray-600 mb-8">{product.description}</p>
          <button onClick={() => addToCart(product)} className="btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
