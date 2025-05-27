import { Axios } from '../axiosInstance';

/**
 * Convert file to base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Default placeholder image to use when upload fails
const DEFAULT_PLACEHOLDER = 'https://placehold.co/600x400?text=Image+Coming+Soon';

/**
 * Upload image to Cloudinary via backend
 */
export const uploadImage = async (file) => {
  try {
    const base64String = await fileToBase64(file);
    
    const { data } = await Axios.post('/upload', {
      file: {
        base64String,
        filename: file.name,
        contentType: file.type
      }
    });
    
    if (data.success) {
      return {
        success: true,
        url: data.secureUrl || data.url,
        error: null
      };
    }
    
    // If not successful, return with placeholder URL
    return {
      success: false,
      url: DEFAULT_PLACEHOLDER, 
      error: data.message || 'Failed to upload image'
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      url: DEFAULT_PLACEHOLDER, 
      error: error.message || 'Failed to upload image'
    };
  }
};

/**
 * Validate image file (type and size)
 */
export const validateImageFile = (file) => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image must be under 5MB' };
  }
  
  return { valid: true, error: null };
};
