const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany();
  console.log('Hotels in DB:', hotels.map(h => ({id: h.id, name: h.name})));
  const reviews = await prisma.review.findMany();
  console.log('Reviews in DB:', reviews.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
