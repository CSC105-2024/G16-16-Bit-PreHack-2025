import { Link } from 'react-router-dom';
import { MapPin, Heart, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-narrow py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MapPin className="h-6 w-6 text-primary-500 mr-2" />
            <span className="text-lg font-semibold text-white">Pinpoint</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
              </a>
            </div>
            <nav className="flex space-x-4 text-sm">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="#" className="hover:text-white transition-colors">About</Link>
              <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-sm text-center md:text-left text-gray-400">
          &copy; {new Date().getFullYear()} Pinpoint. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;