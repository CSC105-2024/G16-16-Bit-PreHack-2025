/**
 * User model containing database operations for user management
 * Handles authentication and profile data
 */

import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

export const UserModel = {
  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  },
  
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  },
  
  async exists(username: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    return !!user;
  },
  
  async create(email: string, username: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  async validatePassword(user: any, password: string) {
    return bcrypt.compare(password, user.password);
  },
  
  async search(query: string, limit: number = 10, currentUserId?: number) {
    let whereClause: any = {
      OR: [
        { username: { contains: query } },
        { email: { contains: query } }
      ]
    };
    
    if (currentUserId) {
      whereClause = {
        AND: [
          whereClause,
          { id: { not: currentUserId } }
        ]
      };
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true
      }
    });
    
    return users;
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  async getUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  async getUsersById(ids: number[]) {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  },

  async updateAvatar(userId: number, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl }
    });
  }
};