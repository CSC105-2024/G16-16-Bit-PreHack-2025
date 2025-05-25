import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { JWT } from '../util/jwt.ts';
import { UserModel } from '../models/user.ts';
<<<<<<< HEAD
import { PrismaClient } from '../src/generated/prisma/index.js';

// Interface for request validation
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

const prisma = new PrismaClient();
=======
>>>>>>> origin/lifeline

export class UserController {
    
  static async register(c: Context) {
    try {      // Parse and validate request body
      const body = await c.req.json() as RegisterRequest;
      const { username: rawUsername, email: rawEmail, password } = body;
      
      // Trim input fields and validate
      const username = rawUsername?.trim();
      const email = rawEmail?.trim();
      
      if (!username || !email || !password?.trim()) {
        return c.json({ 
          success: false, 
          message: 'Username, email and password are required and cannot be empty' 
        }, 400);
      }// Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return c.json({
          success: false,
          message: 'Invalid email format'
        }, 400);
      }

      // Check if user already exists
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User with this email or username already exists' 
        }, 400);
      }
      
      // Create new user
      const user = await UserModel.create(
        email,
        username,
        password
      );
      
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
    try {      // Parse and validate request body
      const body = await c.req.json() as LoginRequest;
      const { email: rawEmail, username: rawUsername, password } = body;
      
      // Trim input fields
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
    /**
   * Get the currently authenticated user's data
   * @param c - Hono Context containing userId from auth middleware
   * @returns User data without sensitive information
   */
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
      
      // Remove sensitive data and return user info
      const { password: _removed, ...safeUser } = user;
      
      return c.json({
        success: true,
        user: safeUser
      });

    } catch (error) {
      // Log the actual error for debugging but send a safe message to client
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
}
