import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Axios } from '../axiosInstance';

// Create the context
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({ city: '', country: '' });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await Axios.get('/posts');
      if (data.success) {
        setPosts(data.posts);
      } else {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
      setIsLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await Axios.get(`/users/${userId}/posts`);
      if (data.success) {
        setUserPosts(data.posts);
      } else {
        throw new Error(data.message || 'Failed to fetch user posts');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user posts');
      setIsLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    setCurrentPost(null);
    try {
      const { data } = await Axios.get(`/posts/${id}`);
      if (data.success) {
        setCurrentPost(data.post);
      } else {
        throw new Error(data.message || 'Post not found');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch post');
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }
      
      if (!postData.location) {
        throw new Error('Location is required');
      }
      
      const requestData = {
        title: postData.title,
        description: postData.description,
        imageUrl: postData.imageUrl || 'https://placehold.co/600x400?text=Image+Coming+Soon',
        lat: postData.location.lat,
        lng: postData.location.lng,
        address: postData.location.address,
        city: postData.location.city,
        country: postData.location.country
      };
      
      console.log('Sending post data:', requestData);
      const { data } = await Axios.post('/posts', requestData);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create post');
      }
      
      setPosts(prevPosts => [data.post, ...prevPosts]);
      setIsLoading(false);
      
      return data.post;
    } catch (error) {
      console.error('Post creation error details:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  const updatePost = useCallback(async (id, postData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to update a post');
      }
      
      if (!postData.location) {
        throw new Error('Location is required');
      }
      
      const requestData = {
        title: postData.title,
        description: postData.description,
        imageUrl: postData.imageUrl,
        lat: postData.location.lat,
        lng: postData.location.lng,
        address: postData.location.address,
        city: postData.location.city,
        country: postData.location.country
      };
      
      const { data } = await Axios.put(`/posts/${id}`, requestData);
      if (!data.success) {
        throw new Error(data.message || 'Failed to update post');
      }
      
      // Update posts array
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === id ? data.post : p
      ));
      
      setCurrentPost(data.post);
      setIsLoading(false);
      
      return data.post;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  const deletePost = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to delete a post');
      }
      
      const { data } = await Axios.delete(`/posts/${id}`);
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete post');
      }
      
      // Update posts array
      setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      setUserPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  const votePost = useCallback(async (id, voteType) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to vote');
      }
      
      const { data } = await Axios.post(`/posts/${id}/vote`, { voteType });
      if (!data.success) {
        throw new Error(data.message || 'Failed to vote');
      }
      
      const updatedPost = data.data;
      
      setPosts(prevPosts => 
        prevPosts.map(p => p.id === id ? updatedPost : p)
      );
      
      if (currentPost?.id === id) {
        setCurrentPost(updatedPost);
      }
      
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to vote');
      setIsLoading(false);
    }
  }, [user, currentPost]);

  const filterPostsByLocation = useCallback(async (city, country) => {
    setIsLoading(true);
    setError(null);
    try {
      setCurrentFilters({ city: city || '', country: country || '' });
      
      // If no filters, just get all posts
      if (!city && !country) {
        return await fetchPosts();
      }
      
      // Build query params properly
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (country) params.append('country', country);
      
      console.log(`Filtering with params: ${params.toString()}`);
      
      const { data } = await Axios.get(`/posts/filter?${params.toString()}`);
      
      if (data.success) {
        setPosts(data.data || []);
      } else {
        throw new Error(data.message || 'Filter failed');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Filter error:', error);
      setError(error instanceof Error ? error.message : 'Failed to filter posts');
      setIsLoading(false);
    }
  }, [fetchPosts]);

  const searchPosts = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!query || query.trim() === '') {
        // If no query but we have filters, respect them
        if (currentFilters?.city || currentFilters?.country) {
          return await filterPostsByLocation(currentFilters.city, currentFilters.country);
        }
        return await fetchPosts();
      }
      
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (currentFilters?.city) params.append('city', currentFilters.city);
      if (currentFilters?.country) params.append('country', currentFilters.country);
      
      const { data } = await Axios.get(`/posts/search?${params.toString()}`);
      
      if (data.success) {
        setPosts(data.data || []);
      } else {
        throw new Error(data.message || 'Search failed');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Failed to search posts');
      setIsLoading(false);
    }
  }, [fetchPosts, filterPostsByLocation, currentFilters]);

  const value = {
    posts,
    userPosts,
    currentPost,
    isLoading,
    error,
    fetchPosts,
    fetchUserPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    votePost,
    searchPosts,
    filterPostsByLocation,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};