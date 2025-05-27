import { Link } from 'react-router-dom';
import { MapPin, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePost } from '../../contexts/PostContext';

const PostCard = ({ post }) => {
  const { isAuthenticated, user } = useAuth();
  const { votePost } = usePost();
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  
  // Check if user has already voted on this post
  useEffect(() => {
    if (isAuthenticated && post.votes && user) {
      const existingVote = post.votes.find(vote => vote.userId === user.id);
      setUserVote(existingVote ? existingVote.type : null);
    }
  }, [isAuthenticated, post.votes, user]);
  
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
      // Update local state to reflect the vote
      setUserVote(userVote === type ? null : type);
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  
  return (
    <div className="card overflow-hidden transition-all duration-300 hover:translate-y-[-5px] group animate-enter">
      <Link to={`/posts/${post.id}`} className="block h-52 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text--700">{post.location.city}, {post.location.country}</span>
        </div>
        
        <Link to={`/posts/${post.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2 line-clamp-1">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <Link to={`/profile/${post.author.id}`} className="flex items-center">
              <img 
                src={post.author.avatar || 'https://placehold.co/600x400/000000/FFFFFF.png?text=Profile'}
                alt={post.author.username}
                className="h-6 w-6 rounded-full mr-2 object-cover"
              />
              <span className="text-sm text-gray-700">{post.author.username}</span>
            </Link>
            
            <div className="flex items-center text-xs text-gray- ml-3">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleVote('up')}
              disabled={!isAuthenticated}
              className={`flex items-center p-1 rounded-md transition-all duration-200 ${
                !isAuthenticated 
                  ? 'opacity-50 cursor-not-allowed' 
                  : userVote === 'up'
                    ? 'bg-green-100 hover:bg-green-200 shadow-sm'
                    : 'hover:bg-gray-100'
              }`}
              title={isAuthenticated ? 'Upvote' : 'Login to vote'}
            >
              <ThumbsUp 
                className={`h-4 w-4 mr-1 transition-colors duration-200 ${
                  userVote === 'up' ? 'text-green-700' : 'text-green-600'
                }`} 
              />
              <span className={`font-semibold transition-colors duration-200 ${
                userVote === 'up' ? 'text-green-700' : 'text-green-600'
              }`}>
                {post.upvotes}
              </span>
            </button>
            
            <button 
              onClick={() => handleVote('down')}
              disabled={!isAuthenticated}
              className={`flex items-center p-1 rounded-md transition-all duration-200 ${
                !isAuthenticated 
                  ? 'opacity-50 cursor-not-allowed' 
                  : userVote === 'down'
                    ? 'bg-pink-100 hover:bg-pink-200 shadow-sm'
                    : 'hover:bg-gray-100'
              }`}
              title={isAuthenticated ? 'Downvote' : 'Login to vote'}
            >
              <ThumbsDown 
                className={`h-4 w-4 mr-1 transition-colors duration-200 ${
                  userVote === 'down' ? 'text-[#d91570]' : 'text-[#ff2b95]'
                }`} 
              />
              <span className={`font-semibold transition-colors duration-200 ${
                userVote === 'down' ? 'text-[#d91570]' : 'text-[#ff2b95]'
              }`}>
                {post.downvotes}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;