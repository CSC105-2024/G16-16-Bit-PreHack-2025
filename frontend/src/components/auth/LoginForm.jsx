import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      // Error is handled by the context
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Pinpoint</h1>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">Sign In to Your Account</h2>
        
        {error && (
          <div className="bg-error-50 text-error-700 p-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="youremail@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;