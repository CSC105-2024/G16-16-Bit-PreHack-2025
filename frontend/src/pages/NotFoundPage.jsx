import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <MapPin className="h-16 w-16 text-gray-400 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;