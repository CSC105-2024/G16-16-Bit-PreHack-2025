import { Context } from 'hono';

/**
 * Upload Controller
 * 
 * NOTE: Image upload functionality is temporarily disabled
 * A complete implementation will be added in the future
 */
export class UploadController {
  // Image upload functionality will be reimplemented
  
  static async uploadImage(c: Context) {
    return c.json({
      success: false, 
      message: 'Image upload functionality is not implemented yet'
    }, 501); 
  }
}