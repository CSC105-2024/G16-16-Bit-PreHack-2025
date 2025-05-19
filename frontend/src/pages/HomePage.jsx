import { useEffect } from 'react';
import PostList from '../components/posts/PostList';
import { useAuthStore } from '../stores/authStore';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    document.title = 'Pinpoint - Share Location-Based Experiences';
  }, []);
  
  return (
    <div>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Explore Experiences</h2>
        </div>
        
        <PostList />
      </section>
    </div>
  );
};

export default HomePage;