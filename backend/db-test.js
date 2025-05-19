import { PrismaClient } from './src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database setup...');
    
    const saltRounds = 10;
    const password = await bcrypt.hash('password123', saltRounds); // simple pwd for testing
    
    const users = [
      {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password,
        bio: 'I am a test user',
        avatarUrl: null
      },
      {
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password,
        bio: 'Hi, I am Jane',
        avatarUrl: null
      },
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password,
        bio: 'Hello, I am John',
        avatarUrl: null
      },
      {
        name: 'Bob Johnson',
        username: 'bjohnson',
        email: 'bob@example.com',
        password,
        bio: 'Hey there, I am Bob',
        avatarUrl: null
      }
    ];
    
    // Reset database
    console.log('Cleaning up existing records...');
 
    await prisma.user.deleteMany({});
    
    console.log('Creating users...');
    for (const userData of users) {
      await prisma.user.create({
        data: userData
      });
    }
    
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();