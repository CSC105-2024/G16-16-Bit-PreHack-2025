import { create } from 'zustand';
import { useAuthStore } from './authStore';

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

export const usePostStore = create((set, get) => {
  return {
    posts: [],
    userPosts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    
    fetchPosts: async () => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ posts: mockPosts, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch posts', 
          isLoading: false 
        });
      }
    },
    
    fetchUserPosts: async (userId) => {
      set({ isLoading: true, error: null, userPosts: [] });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const userPosts = mockPosts.filter(post => post.author.id === userId);
        set({ userPosts, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch user posts', 
          isLoading: false 
        });
      }
    },
    
    fetchPostById: async (id) => {
      set({ isLoading: true, error: null, currentPost: null });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const post = mockPosts.find(p => p.id === id);
        if (!post) {
          throw new Error('Post not found');
        }
        set({ currentPost: post, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch post', 
          isLoading: false 
        });
      }
    },
    
    createPost: async (postData) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = useAuthStore.getState().user;
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
        
        const posts = get().posts;
        set({ posts: [newPost, ...posts], isLoading: false });
        
        return newPost;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create post', 
          isLoading: false 
        });
        throw error;
      }
    },
    
    updatePost: async (id, postData) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = useAuthStore.getState().user;
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
        const posts = get().posts.map(p => 
          p.id === id ? updatedPost : p
        );
        
        set({ 
          posts, 
          currentPost: updatedPost, 
          isLoading: false 
        });
        
        return updatedPost;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update post', 
          isLoading: false 
        });
        throw error;
      }
    },
    
    deletePost: async (id) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = useAuthStore.getState().user;
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
        const posts = get().posts.filter(p => p.id !== id);
        const userPosts = get().userPosts.filter(p => p.id !== id);
        
        set({ posts, userPosts, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete post', 
          isLoading: false 
        });
        throw error;
      }
    },
    
    votePost: async (id, voteType) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const user = useAuthStore.getState().user;
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
        const posts = get().posts.map(p => 
          p.id === id ? updatedPost : p
        );
        
        set({ 
          posts, 
          currentPost: get().currentPost?.id === id ? updatedPost : get().currentPost,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to vote', 
          isLoading: false 
        });
      }
    },
    
    searchPosts: async (query) => {
      set({ isLoading: true, error: null });
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
        
        set({ posts: filteredPosts, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Search failed', 
          isLoading: false 
        });
      }
    },
    
    filterPostsByLocation: async (city, country) => {
      set({ isLoading: true, error: null });
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
        
        set({ posts: filteredPosts, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Filter failed', 
          isLoading: false 
        });
      }
    }
  };
});