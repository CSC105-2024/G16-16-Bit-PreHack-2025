/**
 * Upload Controller with Cloudinary Integration
 */
import { Context } from 'hono';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuration already set up - just update your API secret
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export class UploadController {
  
  static async uploadImage(c: Context) {
    try {
      const { file } = await c.req.json();
      
      if (!file || !file.base64String) {
        return c.json({
          success: false,
          message: 'No image data provided'
        }, 400);
      }
      
      // Generate a unique ID for the image
      const uniqueFileName = `pinpoint_${Date.now()}`;
      
      // Upload the image from base64 data
      const uploadResult = await cloudinary.uploader
        .upload(
          file.base64String, 
          {
            public_id: uniqueFileName,
            resource_type: 'image'
          }
        )
        .catch((error) => {
          console.log(error);
          throw error;
        });
      
      // Generate optimized URL
      const optimizedUrl = cloudinary.url(uploadResult.public_id, {
        fetch_format: 'auto',
        quality: 'auto'
      });
      
      return c.json({
        success: true,
        url: optimizedUrl,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id
      });
    } catch (error) {
      console.error('Upload failed:', error);
      return c.json({
        success: false,
        message: 'Image upload failed'
      }, 500);
    }
  }
  
  static async getImage(c: Context) {
    try {
      const publicId = c.req.param('publicId');
      
      if (!publicId) {
        return c.json({
          success: false,
          message: 'No image ID provided'
        }, 400);
      }
      
      // Generate the optimized URL
      const imageUrl = cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto'
      });
      
      return c.json({
        success: true,
        url: imageUrl
      });
    } catch (error) {
      console.error('Failed to fetch image:', error);
      return c.json({
        success: false,
        message: 'Failed to fetch image'
      }, 500);
    }
  }
}