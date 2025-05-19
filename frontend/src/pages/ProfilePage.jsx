import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, MapPin, Edit3, Trash2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePostStore } from '../stores/postStore';
import PostCard from '../components/posts/PostCard';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const { fetchUserPosts, userPosts, deletePost, isLoading, error } = usePostStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isOwnProfile = user?.id === userId;
  
  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
    }
  }, [userId, fetchUserPosts]);
  
  useEffect(() => {
    document.title = `Profile - Pinpoint`;
  }, []);
  
  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };
  
  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deletePost(postToDelete);
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (!userId || (isLoading && userPosts.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Find the profile user from their posts (in a real app, we'd fetch the user data separately)
  const profileUser = userPosts.length > 0 ? userPosts[0].author : user;
  
  return (
    <div>
      {error && (
        <div className="mb-6 p-3 bg-error-50 text-error-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-primary-600 h-32"></div>
        <div className="px-6 pb-6 relative">
          <img 
            src={profileUser?.avatar || 'https://via.placeholder.com/200'} 
            alt={profileUser?.username} 
            className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white shadow"
          />
          
          <div className="pt-20">
            <h1 className="text-2xl font-bold text-gray-900">
              {profileUser?.username || 'User'}
            </h1>
            
            <div className="flex items-center text-gray-500 mt-2">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span className="text-sm">
                Member since {profileUser?.createdAt ? formatDate(profileUser.createdAt) : 'unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isOwnProfile ? 'My Posts' : `${profileUser?.username}'s Posts`}
          </h2>
          
          {isOwnProfile && (
            <Link to="/create" className="btn-primary">
              Create New Post
            </Link>
          )}
        </div>
        
        {userPosts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {isOwnProfile ? 'You haven\'t shared any experiences yet' : 'No experiences shared yet'}
            </h3>
            {isOwnProfile && (
              <p className="text-gray-500 mb-6">
                Share your first experience by creating a new post.
              </p>
            )}
            {isOwnProfile && (
              <Link to="/create" className="btn-primary">
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div key={post.id} className="relative group">
                <PostCard post={post} />
                
                {isOwnProfile && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-md p-1 hidden group-hover:flex space-x-1">
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="p-1 text-white hover:text-primary-300 transition-colors"
                      title="Edit post"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="p-1 text-white hover:text-error-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
                onClick={confirmDelete}
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

export default ProfilePage;