import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostStore } from '../stores/postStore';
import PostForm from '../components/posts/PostForm';

const CreatePostPage = () => {
  const { createPost, isLoading, error } = usePostStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Create Post - Pinpoint';
  }, []);
  
  const handleSubmit = async (data) => {
    try {
      const newPost = await createPost(data);
      navigate(`/posts/${newPost.id}`);
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Share a New Experience
      </h1>
      
      <PostForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        submitLabel="Create Post"
      />
    </div>
  );
};

export default CreatePostPage;