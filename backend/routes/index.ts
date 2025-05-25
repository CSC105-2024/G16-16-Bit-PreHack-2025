import { Hono } from 'hono';
import { UserController } from '../controllers/user.controller.ts';
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

// everything below needs auth token
protectedRoutes.use('*', authMiddleware);
protectedRoutes.get('/users/me', UserController.getCurrentUser);
protectedRoutes.get('/me', UserController.isAuthenticated);


// Mount protected routes to the main API router
api.route('', protectedRoutes);

export default api;