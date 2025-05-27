import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogIn, LogOut, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-narrow py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
          }}
        >
          <MapPin className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-semibold text-gray-900">Pinpoint</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/create" 
                className="hidden sm:inline-flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-lg bg-blue-500 text-white shadow hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                <span>Create Post</span>
              </Link>
              
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer ">
                  <Link to={`/profile/${user?.id}`} className="flex items-center space-x-2 ">
                    <img 
                      src={user?.avatarUrl || 'https://placehold.co/600x400/000000/FFFFFF.png?text=Profile'} 
                      alt={user?.username} 
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover object-center"
                    />
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </Link>
                </div>
                
                <div className="hidden group-hover:block absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 ">
                  <Link 
                    to={`/profile/${user?.id}`} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              
              <Link 
                to="/create" 
                className="sm:hidden btn-primary p-2 rounded-full"
                aria-label="Create Post"
              >
                <PlusCircle className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;