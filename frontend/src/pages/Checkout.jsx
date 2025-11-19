import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
          <form className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input-field" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input type="tel" className="input-field" />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea className="input-field" rows="3"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input type="text" className="input-field" />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input type="text" className="input-field" />
              </div>
            </div>
          </form>
        </div>
        <div className="card h-fit">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
          </div>
          <button className="btn-primary w-full">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
