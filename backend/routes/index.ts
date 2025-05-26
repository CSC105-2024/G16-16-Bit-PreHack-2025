import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { UserController } from '../controllers/user.controller.ts';
import { PostController } from '../controllers/post.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import { setCookie } from 'hono/cookie';

const api = new Hono();

// Create protected routes for authenticated endpoints
export const protectedRoutes = new Hono();

// auth endpoints - no auth needed for these obviously
api.post('/auth/register', UserController.register);
api.post('/auth/login', UserController.login);
api.post('/auth/logout', (c) => {
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
});

// Public routes - Specific routes before parameterized routes
api.get('/posts', PostController.getAllPosts);
api.get('/posts/filter', PostController.filterPostsByLocation); 
api.get('/posts/search', PostController.searchPosts);           
api.get('/posts/:id', PostController.getPostById);
api.get('/users/:userId/posts', PostController.getUserPosts);

// everything below needs auth token
protectedRoutes.use('*', authMiddleware);
protectedRoutes.get('/users/me', UserController.getCurrentUser);
protectedRoutes.get('/me', UserController.isAuthenticated);

// Post routes that require authentication
protectedRoutes.post('/posts', PostController.createPost);
protectedRoutes.put('/posts/:id', PostController.updatePost);
protectedRoutes.delete('/posts/:id', PostController.deletePost);
protectedRoutes.post('/posts/:id/vote', PostController.votePost);


// Mount protected routes to the main API router
api.route('', protectedRoutes);

export default api;