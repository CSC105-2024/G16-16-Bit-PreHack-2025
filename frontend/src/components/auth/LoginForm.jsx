import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-semibold text-gray-900">Pinpoint</span>
          </div>
        </div>
        
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
          Welcome back
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 relative"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Sign in</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;