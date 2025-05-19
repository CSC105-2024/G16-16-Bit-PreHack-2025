import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ThumbsUp, ThumbsDown, Edit, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import MapView from '../components/posts/MapView';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPost, fetchPostById, votePost, deletePost, isLoading, error } = usePostStore();
  const { user, isAuthenticated } = useAuthStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);
  
  useEffect(() => {
    if (currentPost) {
      document.title = `${currentPost.title} - Pinpoint`;
    } else {
      document.title = 'Post Detail - Pinpoint';
    }
  }, [currentPost]);
  
  const handleVote = async (type) => {
    if (!id || !isAuthenticated) return;
    
    try {
      await votePost(id, type);
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deletePost(id);
      navigate('/');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete post');
      setIsDeleting(false);
    }
  };
  
  const isAuthor = currentPost && user && currentPost.author.id === user.id;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const openInGoogleMaps = () => {
    if (!currentPost) return;
    
    const { lat, lng } = currentPost.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };
  
  if (isLoading || !currentPost) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error-50 text-error-700 p-6 rounded-lg shadow-sm">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-medium mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link 
          to="/" 
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Experiences
        </Link>
        
        {isAuthor && (
          <div className="flex space-x-2">
            <Link 
              to={`/posts/${currentPost.id}/edit`}
              className="btn-outline py-1 px-3 flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
            <button 
              onClick={() => setDeleteModalOpen(true)}
              className="btn-outline text-error-600 border-error-600 hover:bg-error-50 py-1 px-3 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="relative">
          <img 
            src={currentPost.imageUrl} 
            alt={currentPost.title}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {currentPost.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <Link to={`/profile/${currentPost.author.id}`} className="flex items-center">
                <img 
                  src={currentPost.author.avatar} 
                  alt={currentPost.author.username}
                  className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-900">{currentPost.author.username}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(currentPost.createdAt)}
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleVote('up')}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                  isAuthenticated 
                    ? 'bg-gray-100 hover:bg-success-100 hover:text-success-700 transition-colors' 
                    : 'opacity-50 cursor-not-allowed bg-gray-100'
                }`}
                title={isAuthenticated ? 'Upvote' : 'Login to vote'}
              >
                <ThumbsUp className="h-4 w-4 text-success-600" />
                <span className="font-medium">{currentPost.upvotes}</span>
              </button>
              
              <button 
                onClick={() => handleVote('down')}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                  isAuthenticated 
                    ? 'bg-gray-100 hover:bg-error-100 hover:text-error-700 transition-colors' 
                    : 'opacity-50 cursor-not-allowed bg-gray-100'
                }`}
                title={isAuthenticated ? 'Downvote' : 'Login to vote'}
              >
                <ThumbsDown className="h-4 w-4 text-error-600" />
                <span className="font-medium">{currentPost.downvotes}</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center text-gray-700 mb-2">
              <MapPin className="h-5 w-5 text-primary-600 mr-1" />
              <span className="font-medium">{currentPost.location.address}</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {currentPost.location.city}, {currentPost.location.country}
            </div>
            
            <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
              <MapView location={currentPost.location} />
            </div>
            
            <button
              onClick={openInGoogleMaps}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View in Google Maps
            </button>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{currentPost.description}</p>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Post
            </h3>
            
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md text-sm">
                {deleteError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="btn-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-error bg-error-600 text-white hover:bg-error-700 relative"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="opacity-0">Delete</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;