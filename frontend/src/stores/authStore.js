import { create } from 'zustand';

// In a real app, we would use actual API calls for these operations
// This is a mock implementation for the MVP

export const useAuthStore = create((set) => {
  const mockUsers = [
    {
      id: '1',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123', // In a real app, passwords would be hashed
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'janedoe',
      email: 'jane@example.com',
      password: 'password123',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = user;
        
        // Store user in localStorage (in a real app, we would store a token)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        set({ 
          user: userWithoutPassword, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Login failed', 
          isLoading: false
        });
      }
    },

    register: async (email, username, password) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (mockUsers.some(u => u.email === email)) {
          throw new Error('Email already exists');
        }
        
        if (mockUsers.some(u => u.username === username)) {
          throw new Error('Username already exists');
        }
        
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          username,
          email,
          password,
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 60) + 1}.jpg`,
          createdAt: new Date().toISOString(),
        };
        
        mockUsers.push(newUser);
        
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = newUser;
        
        // Store user in localStorage (in a real app, we would store a token)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        set({ 
          user: userWithoutPassword, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Registration failed', 
          isLoading: false
        });
      }
    },

    logout: () => {
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    },

    checkAuth: () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          set({ user, isAuthenticated: true });
        } catch (error) {
          localStorage.removeItem('user');
          set({ user: null, isAuthenticated: false });
        }
      }
    },
  };
});