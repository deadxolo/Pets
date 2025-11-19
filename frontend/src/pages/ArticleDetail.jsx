import { useParams } from 'react-router-dom';

const ArticleDetail = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="card">
        <h1 className="text-4xl font-bold mb-4">Article Title</h1>
        <p className="text-gray-600 mb-8">Published on {new Date().toLocaleDateString()}</p>
        <div className="prose max-w-none">
          <p>This is the article content for article ID: {id}</p>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
