import { useEffect, useState } from 'react';
import { usePostStore } from '../../stores/postStore';
import PostCard from './PostCard';
import { Search, MapPin, Filter } from 'lucide-react';

const PostList = () => {
  const { posts, fetchPosts, searchPosts, filterPostsByLocation, isLoading, error } = usePostStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Get unique countries and cities from posts
  const countries = [...new Set(posts.map(post => post.location.country))];
  const cities = selectedCountry 
    ? [...new Set(posts
        .filter(post => post.location.country === selectedCountry)
        .map(post => post.location.city))]
    : [];
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    searchPosts(searchQuery);
  };
  
  const handleFilterApply = () => {
    filterPostsByLocation(selectedCity, selectedCountry);
    setShowFilters(false);
  };
  
  const handleClearFilters = () => {
    setSelectedCountry('');
    setSelectedCity('');
    fetchPosts();
    setShowFilters(false);
  };
  
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-md">
        <p>Error loading posts: {error}</p>
        <button 
          onClick={() => fetchPosts()}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700"
        >
          Try again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <form onSubmit={handleSearch} className="flex-grow relative">
            <input
              type="text"
              placeholder="Search for experiences, cities, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pr-10 w-full"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center space-x-1 py-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedCity('');
                  }}
                  className="input-field w-full"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="input-field w-full"
                  disabled={!selectedCountry}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleClearFilters}
                className="btn-outline"
              >
                Clear
              </button>
              <button
                onClick={handleFilterApply}
                className="btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {selectedCountry || selectedCity ? (
          <div className="mt-4 flex items-center text-sm">
            <MapPin className="h-4 w-4 text-primary-600 mr-1" />
            <span className="font-medium">Filtered by:</span>
            {selectedCountry && (
              <span className="ml-1 tag">
                {selectedCountry}
              </span>
            )}
            {selectedCity && (
              <span className="ml-1 tag">
                {selectedCity}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="ml-2 text-primary-600 hover:text-primary-700 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery ? 
              `No posts match your search "${searchQuery}". Try another search term or clear filters.` :
              `No posts available. ${selectedCountry || selectedCity ? 'Try different location filters.' : ''}`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;