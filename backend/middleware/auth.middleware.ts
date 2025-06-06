// this middleware checks if users are logged in before they can access stuff
// verifies tokens and attaches user data to the request

import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { JWT } from '../util/jwt.ts';
import { UserModel } from '../models/user.ts';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    let token = getCookie(c, 'auth_token');
    
    if (!token) {
      const authHeader = c.req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return c.json({ 
        success: false, 
        message: 'Authentication required' 
      }, 401);
    }

    try {
      const decoded = JWT.verify(token);
      c.set('userId', decoded.userId);
      
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      c.set('user', user);
      await next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return c.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, 401);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return c.json({ 
      success: false, 
      message: 'Authentication failed' 
    }, 500);
  }
};