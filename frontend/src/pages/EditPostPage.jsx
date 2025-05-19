import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/posts/PostForm';
import { AlertCircle } from 'lucide-react';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPost, fetchPostById, updatePost, isLoading, error } = usePost();
  
  useEffect(() => {
    document.title = 'Edit Post - Pinpoint';
    
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);
  
  const handleSubmit = async (data) => {
    if (!id) return;
    
    try {
      await updatePost(id, data);
      navigate(`/posts/${id}`);
    } catch (error) {
      // Error is handled by the context
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
  
  if (currentPost && user && currentPost.author.id !== user.id) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>You can only edit your own posts</p>
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
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>Post not found</p>
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
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Experience
      </h1>
      
      <PostForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        submitLabel="Update Post"
        initialValues={currentPost}
      />
    </div>
  );
};

export default EditPostPage;