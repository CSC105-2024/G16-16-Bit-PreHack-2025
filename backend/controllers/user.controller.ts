import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { JWT } from '../util/jwt.ts';
import { UserModel } from '../models/user.ts';
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

export class UserController {
    
  static async register(c: Context) {
    try {
      const body = await c.req.json();
      const { username, email, name, password } = body;
      
      if (!username || !email || !password) {
        return c.json({ 
          success: false, 
          message: 'Username, email and password are required' 
        }, 400);
      }
      
      const userExists = await UserModel.exists(username, email);
      if (userExists) {
        return c.json({ 
          success: false, 
          message: 'User with this email or username already exists' 
        }, 400);
      }
      
      const user = await UserModel.create(
        email,
        username,
        password
      );
      
      const token = JWT.generate(user.id);
      
      // set cookie so user stays logged in
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
      const { email, username, password } = await c.req.json();
      
      if (!password || (!email && !username)) {
        return c.json({ 
          success: false, 
          message: 'Email/username and password are required' 
        }, 400);
      }
      
      let user;
      // can login with either email or username
      if (email) {
        user = await UserModel.findByEmail(email);
      } else {
        user = await UserModel.findByUsername(username);
      }
      
      if (!user) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      const isValidPassword = await UserModel.validatePassword(user, password);
      if (!isValidPassword) {
        return c.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, 401);
      }
      
      const token = JWT.generate(user.id);

      UserController.setAuthCookie(c, token);

      // don't send the password back to client
      const { password: _, ...userWithoutPassword } = user;
      
      return c.json({
        success: true,
        user: userWithoutPassword,
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
        const userId = c.get('userId');
      
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Not authenticated' 
        }, 401);
      }
      
      const userData = await UserModel.findById(userId);
      
      if (!userData) {
        return c.json({ 
          success: false, 
          message: 'User not found' 
        }, 404);
      }
      
      // remove password before sending to frontend
      const { password, ...userWithoutPassword } = userData;
      
      return c.json({
        success: true,
        user: userWithoutPassword
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
}
