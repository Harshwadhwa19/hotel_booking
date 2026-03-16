const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
    const hotels = await prisma.hotel.findMany();
    console.log('Hotels count:', hotels.length);
    console.log('DB Connection: OK');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
