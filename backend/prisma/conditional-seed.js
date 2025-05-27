import { PrismaClient } from '../src/generated/prisma/index.js'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const prisma = new PrismaClient()

async function checkAndSeed() {
  try {
    console.log('checking if the db’s already been seeded...')

    const existingPost = await prisma.post.findFirst({
      where: {
        title: '🗣️🔥'
      }
    })

    if (existingPost) {
      console.log('already handled, no need to do it again')
      return
    }

    console.log('seeding the database...')
    const { stdout, stderr } = await execAsync('npx tsx prisma/seed.js')

    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    console.log('seeding finished')
  } catch (error) {
    console.error('something went sideways during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndSeed()
