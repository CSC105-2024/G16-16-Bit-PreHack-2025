import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Image, AlertCircle } from 'lucide-react';
import MapView from './MapView';

const PostForm = ({ 
  initialData, 
  onSubmit, 
  isLoading, 
  error,
  submitLabel = 'Create Post'
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState(initialData?.location || null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialData?.imageUrl || null);
  const [imageError, setImageError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      return;
    }

    if (!imageFile && !initialData?.imageUrl) {
      setImageError('Please select an image');
      return;
    }
    
    try {
      setIsUploading(true);
      let imageUrl = initialData?.imageUrl || '';

      if (imageFile) {
        // Simulate image upload with a delay and generate a fake URL
        await new Promise(resolve => setTimeout(resolve, 1000));
        imageUrl = URL.createObjectURL(imageFile);
        
        // In a real app, you would replace this with your actual image upload code
        // For example using a service like Cloudinary, AWS S3, or your own server
        console.log('Image would be uploaded here in a real app');
      }

      const formData = {
        title,
        description,
        imageUrl,
        location
      };
      
      await onSubmit(formData);
    } catch (error) {
      setImageError('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setImageError(null);
    setPreviewImage(URL.createObjectURL(file));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-error-50 text-error-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
            placeholder="Great Coffee Shop in Paris"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="input-field resize-none"
            placeholder="Share your experience about this place..."
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-500 transition-colors">
            <div className="space-y-1 text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
          {imageError && (
            <p className="mt-1 text-sm text-error-600">{imageError}</p>
          )}
        </div>
        
        {previewImage && (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-48 object-cover"
              onError={() => {
                setImageError('Failed to load image preview');
                setPreviewImage(null);
              }} 
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <div className="mt-1">
            <MapView 
              location={location} 
              isEditable={true}
              onLocationChange={handleLocationChange}
            />
          </div>
          {!location && (
            <p className="mt-1 text-sm text-error-600">Please select a location on the map</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-outline"
          disabled={isLoading || isUploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isUploading || !location}
          className="btn-primary relative"
        >
          {isLoading || isUploading ? (
            <>
              <span className="opacity-0">{submitLabel}</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;