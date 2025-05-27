import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

async function main() {
  try {
    console.log('🌱 Seeding database...');
    
    const hashedPassword = await hashPassword('password123');
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        avatarUrl: 'https://placehold.co/400x400/3498db/ffffff?text=T'
      }
    });

    console.log('✅ Created test user:', { 
      id: testUser.id, 
      username: testUser.username, 
      email: testUser.email 
    });

    const lat = 26 + (40/60) + (0/3600);     
    const lng = -(80 + (5/60) + (21/3600)); 

    // Create sample post
    const samplePost = await prisma.post.upsert({
      where: { 
        id: 1 
      },
      update: {},
      create: {
        title: '🗣️🔥',
        description: '（￣。。￣',
        imageUrl: 'https://res.cloudinary.com/dboeqtx65/image/upload/v1748353958/pinpoint_1748353955890.jpg',
        lat: lat,
        lng: lng,
        address: 'West Palm Beach, FL, USA',
        city: 'West Palm Beach',
        country: 'United States',
        authorId: testUser.id,
        upvotes: 5,
        downvotes: 1
      }
    });

    console.log('✅ Created sample post:', { 
      id: samplePost.id,
      title: samplePost.title,
      location: `${samplePost.lat}, ${samplePost.lng}`
    });
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });