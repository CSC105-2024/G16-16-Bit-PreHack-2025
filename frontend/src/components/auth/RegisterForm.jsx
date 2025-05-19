import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, username, password);
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
          Create your account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field pl-10"
                placeholder="cooluser123"
              />
            </div>
          </div>
          
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
                minLength={8}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters.
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 relative"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Create account</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;