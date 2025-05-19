import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Create the context
const PostContext = createContext();
// Mock data for posts
const mockPosts = [
  {
    id: '1',
    title: 'Charming Café in Paris',
    description: 'Discovered this hidden gem in the heart of Montmartre. The croissants are heavenly and the coffee is perfectly brewed. The vintage interior and friendly staff make it a must-visit spot.',
    imageUrl: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: {
      lat: 48.8566,
      lng: 2.3522,
      address: '123 Rue de Montmartre',
      city: 'Paris',
      country: 'France'
    },
    author: {
      id: '1',
      username: 'traveler_sophie',
      email: 'sophie@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      createdAt: '2024-01-15T10:00:00Z'
    },
    upvotes: 124,
    downvotes: 5,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Breathtaking Viewpoint in Kyoto',
    description: 'This secret spot offers the most incredible view of Kyoto at sunset. The walk up might be challenging, but the panoramic view of temples and cherry blossoms makes it absolutely worth it.',
    imageUrl: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: {
      lat: 35.0116,
      lng: 135.7681,
      address: 'Kiyomizu Temple Path',
      city: 'Kyoto',
      country: 'Japan'
    },
    author: {
      id: '2',
      username: 'wanderlust_kai',
      email: 'kai@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      createdAt: '2024-01-10T15:30:00Z'
    },
    upvotes: 89,
    downvotes: 2,
    createdAt: '2024-02-20T15:30:00Z',
    updatedAt: '2024-02-20T15:30:00Z'
  },
  {
    id: '3',
    title: 'Secret Beach in Tulum',
    description: 'Found this pristine beach away from the tourist crowds. Crystal clear waters, soft white sand, and barely any people around. Perfect spot for swimming and snorkeling!',
    imageUrl: 'https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: {
      lat: 20.2114,
      lng: -87.4654,
      address: 'Tulum Beach Road',
      city: 'Tulum',
      country: 'Mexico'
    },
    author: {
      id: '3',
      username: 'beach_lover',
      email: 'maria@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      createdAt: '2024-01-05T09:15:00Z'
    },
    upvotes: 156,
    downvotes: 4,
    createdAt: '2024-02-25T09:15:00Z',
    updatedAt: '2024-02-25T09:15:00Z'
  }
];

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const userPosts = mockPosts.filter(post => post.author.id === userId);
      setUserPosts(userPosts);
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }
      setCurrentPost(post);
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }
      
      if (!postData.location) {
        throw new Error('Location is required');
      }
      
      const newPost = {
        id: (mockPosts.length + 1).toString(),
        ...postData,
        location: postData.location,
        author: user,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockPosts.unshift(newPost);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsLoading(false);
      
      return newPost;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  const updatePost = useCallback(async (id, postData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error('You must be logged in to update a post');
      }
      
      const postIndex = mockPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      if (mockPosts[postIndex].author.id !== user.id) {
        throw new Error('You can only edit your own posts');
      }
      
      if (!postData.location) {
        throw new Error('Location is required');
      }
      
      const updatedPost = {
        ...mockPosts[postIndex],
        ...postData,
        location: postData.location,
        updatedAt: new Date().toISOString()
      };
      
      mockPosts[postIndex] = updatedPost;
      
      // Update posts array
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === id ? updatedPost : p
      ));
      
      setCurrentPost(updatedPost);
      setIsLoading(false);
      
      return updatedPost;
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error('You must be logged in to delete a post');
      }
      
      const postIndex = mockPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      if (mockPosts[postIndex].author.id !== user.id) {
        throw new Error('You can only delete your own posts');
      }
      
      // Remove post from mock data
      mockPosts.splice(postIndex, 1);
      
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        throw new Error('You must be logged in to vote');
      }
      
      const postIndex = mockPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      let updatedPost = { ...mockPosts[postIndex] };
      
      if (voteType === 'up') {
        updatedPost.upvotes += 1;
      } else if (voteType === 'down') {
        updatedPost.downvotes += 1;
      }
      
      mockPosts[postIndex] = updatedPost;
      
      // Update posts and currentPost if needed
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

  const searchPosts = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const lowerQuery = query.toLowerCase();
      const filteredPosts = mockPosts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.description.toLowerCase().includes(lowerQuery) ||
        post.location.city.toLowerCase().includes(lowerQuery) ||
        post.location.country.toLowerCase().includes(lowerQuery)
      );
      
      setPosts(filteredPosts);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
      setIsLoading(false);
    }
  }, []);

  const filterPostsByLocation = useCallback(async (city, country) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let filteredPosts = [...mockPosts];
      
      if (city) {
        filteredPosts = filteredPosts.filter(post => 
          post.location.city.toLowerCase() === city.toLowerCase()
        );
      }
      
      if (country) {
        filteredPosts = filteredPosts.filter(post => 
          post.location.country.toLowerCase() === country.toLowerCase()
        );
      }
      
      setPosts(filteredPosts);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Filter failed');
      setIsLoading(false);
    }
  }, []);

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
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};