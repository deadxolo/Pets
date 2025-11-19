const Consultant = () => {
  const articles = [
    { id: 1, title: 'Pet Health Tips for Winter', category: 'Health Tips' },
    { id: 2, title: 'Grooming Your Dog at Home', category: 'Grooming' },
    { id: 3, title: 'Training Your Puppy', category: 'Training' },
    { id: 4, title: 'Seasonal Care Guide', category: 'Seasonal Care' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Pet Care Consultant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.id} className="card">
            <span className="text-sm text-primary-600 font-semibold">{article.category}</span>
            <h3 className="text-xl font-semibold mt-2 mb-4">{article.title}</h3>
            <button className="text-primary-600 hover:underline">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Consultant;
