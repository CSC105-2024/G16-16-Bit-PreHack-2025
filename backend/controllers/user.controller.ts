import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { JWT } from '../util/jwt.ts';
import { UserModel } from '../models/user.ts';
import { z } from 'zod';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
  bio?: string;
}

interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}


// Zod schema for email validation
const emailSchema = z.string().email('Invalid email format');

export class UserController {
    
  static async register(c: Context) {
    try {
      // Parse request body
      let { username, email, password } = await c.req.json() as RegisterRequest;
      
      if (username) username = username.trim();
      if (email) email = email.trim();
      if (password) password = password.trim();
      
      // Validate required fields
      if (!username || !email || !password) {
        return c.json({ 
          success: false, 
          message: 'Username, email and password are required and cannot be empty' 
        }, 400);
      }
      
      // Validate email with Zod
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        return c.json({
          success: false,
          message: 'Invalid email format'
        }, 400);
      }

      // Check if user exists
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User with this email or username already exists' 
        }, 400);
      }
      
      // Create user and handle authentication
      const user = await UserModel.create(email, username, password);
      const token = JWT.generate(user.id);
      UserController.setAuthCookie(c, token);
      
      return c.json({
        success: true,
        user,
        token
      }, 201);
    } catch (error) {
      console.error('Registration error:', error);
      return c.json({ 
        success: false, 
        message: 'Error during registration' 
      }, 500);
    }
  }
  
  static async login(c: Context) {
    try {      
      // Parse and validate request body
      const body = await c.req.json() as LoginRequest;
      const { email: rawEmail, username: rawUsername, password } = body;
      
      const email = rawEmail?.trim();
      const username = rawUsername?.trim();
      
      // Validate required fields
      if (!password || (!email && !username)) {
        return c.json({ 
          success: false, 
          message: 'Email/username and password are required' 
        }, 400);
      }
      
      // Find user by email or username
      const user = email 
        ? await UserModel.findByEmail(email)
        : await UserModel.findByUsername(username!);
      
      // Check if user exists and password is valid
      if (!user || !await UserModel.validatePassword(user, password)) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      // Generate and set auth token
      const token = JWT.generate(user.id);
      UserController.setAuthCookie(c, token);
      
      return c.json({
        success: true,
        user,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ 
        success: false, 
        message: 'Error during login' 
      }, 500);
    }
  }
    
  static async getCurrentUser(c: Context) {
    try {
      // Get userId from context (set by auth middleware)
      const userId = c.get('userId');
      
      // Early return if not authenticated
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Not authenticated' 
        }, 401);
      }
      
      // Fetch user data from database
      const user = await UserModel.findById(userId);
      
      // Handle case where user was deleted but token is still valid
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      const { password: _removed, ...safeUser } = user;
      
      return c.json({
        success: true,
        user: safeUser
      });

    } catch (error) {
      console.error('Get current user error:', error);
      return c.json({ 
        success: false, 
        message: 'Error retrieving user data' 
      }, 500);
    }
  }
  
  
  static async isAuthenticated(c: Context) {
    try {
      // If this endpoint is reached through authMiddleware, the user is authenticated
      // The userId will be available in the context
      const userId = c.get('userId');
      
      if (userId) {
        return c.json({
          success: true,
          isAuthenticated: true
        });
      }
      
      return c.json({
        success: false,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Authentication check error:', error);
      return c.json({ 
        success: false, 
        isAuthenticated: false
      });
    }
  }

  static async logout(c: Context) {
    try {
      setCookie(c, 'auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: 0,
      });
      
      return c.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return c.json({ 
        success: false, 
        message: 'Error during logout' 
      }, 500);
    }
  }

  static setAuthCookie(c: Context, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    });
  }

  static async updateProfile(c: Context) {
    try {
      const userId = c.get('userId');
      const { avatarUrl } = await c.req.json();
      
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Not authenticated' 
        }, 401);
      }
      
      // Update the user's avatar URL
      if (avatarUrl) {
        await UserModel.updateAvatar(userId, avatarUrl);
      }
      
      // Get the updated user
      const updatedUser = await UserModel.findById(userId);
      if (!updatedUser) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      const { password: _, ...safeUser } = updatedUser;
      
      return c.json({
        success: true,
        user: safeUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return c.json({ 
        success: false, 
        message: 'Failed to update profile' 
      }, 500);
    }
  }
}
