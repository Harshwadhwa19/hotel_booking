const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true, category: true }
  });
  console.log('Hotels in DB with categories:', hotels);
  
  const distinctCategories = await prisma.hotel.findMany({
    distinct: ['category'],
    select: { category: true }
  });
  console.log('Distinct categories in DB:', distinctCategories.map(c => c.category));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
