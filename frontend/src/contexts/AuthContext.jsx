import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the context
const AuthContext = createContext();

// Mock users data
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
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
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, username, password) => {
    setIsLoading(true);
    setError(null);
    
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
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};