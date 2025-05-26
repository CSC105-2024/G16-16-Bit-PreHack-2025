import { Context } from 'hono';
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

export class PostController {
  // Helper method to format posts consistently
  private static formatPost(post: any) {
    return {
      id: post.id.toString(),
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      location: {
        lat: post.lat,
        lng: post.lng,
        address: post.address,
        city: post.city,
        country: post.country
      },
      author: {
        id: post.author.id.toString(),
        username: post.author.username,
        email: post.author.email,
        avatar: post.author.avatarUrl,
        createdAt: post.author.createdAt.toISOString()
      },
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  }

  static async createPost(c: Context) {
    try {
      const { title, description, imageUrl, lat, lng, address, city, country } = await c.req.json();
      const user = c.get('user');

      if (!title || !description || !imageUrl || lat === undefined || lng === undefined || !address || !city || !country) {
        return c.json({ success: false, message: 'Missing required fields' }, 400);
      }
      
      const post = await prisma.post.create({
        data: {
          title,
          description,
          imageUrl,
          lat,
          lng,
          address,
          city,
          country,
          authorId: user.id
        },
        include: {
          author: true
        }
      });

      const formattedPost = PostController.formatPost(post);

      return c.json({ success: true, post: formattedPost }, 201);
    } catch (error) {
      console.error('Error creating post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async getAllPosts(c: Context) {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({ success: true, posts: formattedPosts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async getPostById(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      
      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true
        }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      const formattedPost = PostController.formatPost(post);

      return c.json({ success: true, post: formattedPost });
    } catch (error) {
      console.error('Error fetching post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async getUserPosts(c: Context) {
    try {
      const userId = parseInt(c.req.param('userId'));
      
      if (isNaN(userId)) {
        return c.json({ success: false, message: 'Invalid user ID' }, 400);
      }

      const posts = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({ success: true, posts: formattedPosts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async updatePost(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      const user = c.get('user');
      const { title, description, imageUrl, lat, lng, address, city, country } = await c.req.json();

      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

    //   if (post.authorId !== user.id) {
    //     return c.json({ success: false, message: 'You can only update your own posts' }, 403);
    //   }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          description,
          imageUrl,
          lat,
          lng,
          address,
          city,
          country
        },
        include: {
          author: true
        }
      });

      const formattedPost = PostController.formatPost(updatedPost);

      return c.json({ success: true, post: formattedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async deletePost(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      const user = c.get('user');

      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      if (post.authorId !== user.id) {
        return c.json({ success: false, message: 'You can only delete your own posts' }, 403);
      }

      await prisma.post.delete({
        where: { id: postId }
      });

      return c.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async votePost(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      const { voteType } = await c.req.json();

      // Validate inputs
      if (isNaN(postId) || (voteType !== 'up' && voteType !== 'down')) {
        return c.json({ 
          success: false, 
          message: isNaN(postId) ? 'Invalid post ID' : 'Invalid vote type' 
        }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          upvotes: voteType === 'up' ? { increment: 1 } : undefined,
          downvotes: voteType === 'down' ? { increment: 1 } : undefined
        },
        include: { author: true }
      }).catch(() => null);

      if (!updatedPost) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      // Format the response
      return c.json({
        success: true,
        data: PostController.formatPost(updatedPost)
      });
    } catch (error) {
      console.error('Error voting on post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async searchPosts(c: Context) {
    try {
      const query = c.req.query('q') || '';
      const city = c.req.query('city');
      const country = c.req.query('country');
      
      // Build where condition for filtering
      let whereCondition: any = {};
      
      // If there's a search query, add the search conditions
      if (query && query.trim() !== '') {
        whereCondition.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
          { city: { contains: query } },
          { country: { contains: query } }
        ];
      }
      
      // Apply category filters if provided
      if (city && city.trim() !== '') {
        whereCondition = {
          ...whereCondition,
          city: { contains: city }
        };
      }
      
      if (country && country.trim() !== '') {
        whereCondition = {
          ...whereCondition,
          country: { contains: country }
        };
      }
      
      const posts = await prisma.post.findMany({
        where: whereCondition,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      // Format the posts before returning
      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({ success: true, data: formattedPosts });
    } catch (error) {
      console.error('Error searching posts:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async filterPostsByLocation(c: Context) {
    try {
      const city = c.req.query('city');
      const country = c.req.query('country');
      
      // Simple and direct filtering logic
      const whereCondition: any = {};
      
      if (city && city.trim() !== '') {
        whereCondition.city = { contains: city };
      }
      
      if (country && country.trim() !== '') {
        whereCondition.country = { contains: country };
      }

      const posts = await prisma.post.findMany({
        where: whereCondition,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      // Format the posts using the same formatting function
      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({
        success: true,
        data: formattedPosts
      });
    } catch (error) {
      console.error('Error filtering posts by location:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  private static async getAllPostsInternal() {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });

    return posts.map(post => PostController.formatPost(post));
  }
}