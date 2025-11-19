const MyOrders = () => {
  const orders = [
    { id: 'ORD001', date: '2025-11-18', total: 2500, status: 'Delivered' },
    { id: 'ORD002', date: '2025-11-15', total: 1200, status: 'In Transit' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{order.total}</p>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
