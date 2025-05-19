import { Link } from 'react-router-dom';
import { MapPin, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePostStore } from '../../stores/postStore';

const PostCard = ({ post }) => {
  const { isAuthenticated } = useAuthStore();
  const { votePost } = usePostStore();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleVote = async (type) => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      await votePost(post.id, type);
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  
  return (
    <div className="card overflow-hidden transition-all duration-300 hover:translate-y-[-5px] group animate-enter">
      <div className="relative">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold truncate">{post.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 text-primary-500" />
          <span className="truncate">{post.location.city}, {post.location.country}</span>
        </div>
        
        <p className="text-gray-700 line-clamp-2 mb-4 text-sm">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author.id}`} className="flex items-center">
              <img 
                src={post.author.avatar}
                alt={post.author.username}
                className="h-6 w-6 rounded-full mr-2 object-cover"
              />
              <span className="text-sm text-gray-700">{post.author.username}</span>
            </Link>
            
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleVote('up')}
              disabled={!isAuthenticated}
              className={`flex items-center p-1 rounded-md ${isAuthenticated ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              title={isAuthenticated ? 'Upvote' : 'Login to vote'}
            >
              <ThumbsUp className="h-4 w-4 text-success-600 mr-1" />
              <span className="text-xs font-medium">{post.upvotes}</span>
            </button>
            
            <button 
              onClick={() => handleVote('down')}
              disabled={!isAuthenticated}
              className={`flex items-center p-1 rounded-md ${isAuthenticated ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              title={isAuthenticated ? 'Downvote' : 'Login to vote'}
            >
              <ThumbsDown className="h-4 w-4 text-error-600 mr-1" />
              <span className="text-xs font-medium">{post.downvotes}</span>
            </button>
          </div>
        </div>
        
        <Link 
          to={`/posts/${post.id}`}
          className="block mt-4 btn-primary w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PostCard;