import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ThumbsUp, ThumbsDown, Edit, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { usePost } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import MapView from '../components/posts/MapView';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPost, fetchPostById, votePost, deletePost, isLoading, error } = usePost();
  const { user, isAuthenticated } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  
  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);
  
  // Check if user has already voted on this post
  useEffect(() => {
    if (isAuthenticated && currentPost && currentPost.votes && user) {
      const existingVote = currentPost.votes.find(vote => vote.userId === user.id);
      setUserVote(existingVote ? existingVote.type : null);
    }
  }, [isAuthenticated, currentPost, user]);
  
  useEffect(() => {
    if (currentPost) {
      document.title = `${currentPost.title} - Pinpoint`;
    } else {
      document.title = 'Post Detail - Pinpoint';
    }
  }, [currentPost]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const handleVote = async (type) => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      await votePost(id, type);
      // Update local state to reflect the vote
      setUserVote(userVote === type ? null : type);
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    setDeleteError(null);
  };
  
  const confirmDelete = async () => {
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
  
  if (isLoading && !currentPost) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 btn-outline"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!currentPost) {
    return null;
  }
  
  const isOwnPost = user && currentPost.author.id === user.id;
  
  return (
    <>
      <div className="mb-6">
        <Link 
          to="/"
          className="text-sm text-gray-500 hover:text-primary-600 flex items-center"
        >
          ← Back to all posts
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="h-96 relative">
          <img 
            src={currentPost.imageUrl}
            alt={currentPost.title}
            className="w-full h-full object-cover"
          />
          
          {isOwnPost && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Link
                to={`/posts/${currentPost.id}/edit`}
                className="p-2 bg-white bg-opacity-90 rounded-md shadow text-gray-700 hover:text-primary-600 transition-colors"
                title="Edit post"
              >
                <Edit className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDeleteClick}
                className="p-2 bg-white bg-opacity-90 rounded-md shadow text-gray-700 hover:text-error-600 transition-colors"
                title="Delete post"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 text-primary-500 mr-1" />
            <span>{currentPost.location.address}, {currentPost.location.city}, {currentPost.location.country}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentPost.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link to={`/profile/${currentPost.author.id}`} className="flex items-center group">
                <img 
                  src={currentPost.author.avatar || 'https://placehold.co/600x400/000000/FFFFFF.png?text=Profile'}
                  alt={currentPost.author.username}
                  className="h-10 w-10 rounded-full mr-3 border border-gray-200"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {currentPost.author.username}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(currentPost.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleVote('up')}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-1 p-2 rounded-md transition-all duration-200 ${
                  !isAuthenticated 
                    ? 'opacity-60 cursor-not-allowed'
                    : userVote === 'up'
                      ? 'bg-green-100 hover:bg-green-200 shadow-sm'
                      : 'hover:bg-gray-100'
                }`}
                title={isAuthenticated ? 'Upvote' : 'Login to vote'}
              >
                <ThumbsUp 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    userVote === 'up' ? 'text-green-700' : 'text-green-600'
                  }`} 
                />
                <span className={`font-medium transition-colors duration-200 ${
                  userVote === 'up' ? 'text-green-700' : 'text-green-600'
                }`}>
                  {currentPost.upvotes}
                </span>
              </button>
              
              <button 
                onClick={() => handleVote('down')}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-1 p-2 rounded-md transition-all duration-200 ${
                  !isAuthenticated 
                    ? 'opacity-60 cursor-not-allowed'
                    : userVote === 'down'
                      ? 'bg-pink-100 hover:bg-pink-200 shadow-sm'
                      : 'hover:bg-gray-100'
                }`}
                title={isAuthenticated ? 'Downvote' : 'Login to vote'}
              >
                <ThumbsDown 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    userVote === 'down' ? 'text-[#d91570]' : 'text-[#ff2b95]'
                  }`} 
                />
                <span className={`font-medium transition-colors duration-200 ${
                  userVote === 'down' ? 'text-[#d91570]' : 'text-[#ff2b95]'
                }`}>
                  {currentPost.downvotes}
                </span>
              </button>
            </div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p>{currentPost.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            
            <div className="h-80 border border-gray-200 rounded-lg overflow-hidden mb-4">
              <MapView 
                location={{
                  lat: currentPost.location.lat,
                  lng: currentPost.location.lng,
                  address: currentPost.location.address,
                  city: currentPost.location.city,
                  country: currentPost.location.country
                }} 
                markerTitle={currentPost.title}
              />
            </div>
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentPost.location.lat},${currentPost.location.lng}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>View on Google Maps</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Post
            </h3>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            
            {deleteError && (
              <div className="bg-error-50 text-error-700 p-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{deleteError}</p>
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
                onClick={confirmDelete}
                className="btn-error"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailPage;