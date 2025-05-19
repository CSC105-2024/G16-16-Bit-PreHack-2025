import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePostStore } from '../stores/postStore';
import PostForm from '../components/posts/PostForm';
import { useAuthStore } from '../stores/authStore';
import { AlertCircle } from 'lucide-react';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentPost, fetchPostById, updatePost, isLoading, error } = usePostStore();
  
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
      // Error is handled by the store
    }
  };
  
  if (isLoading || !currentPost) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Check if user is the author
  if (currentPost.author.id !== user?.id) {
    return (
      <div className="bg-error-50 text-error-700 p-6 rounded-lg shadow-sm">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-medium mb-2">Not Authorized</h2>
            <p className="mb-4">You don't have permission to edit this post.</p>
            <button
              onClick={() => navigate(-1)}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const initialData = {
    title: currentPost.title,
    description: currentPost.description,
    imageUrl: currentPost.imageUrl,
    location: currentPost.location
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Your Experience
      </h1>
      
      <PostForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        submitLabel="Update Post"
      />
    </div>
  );
};

export default EditPostPage;