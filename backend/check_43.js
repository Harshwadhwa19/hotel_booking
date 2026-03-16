const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.hotel.findUnique({ where: { id: 43 } });
  console.log('Hotel 43:', hotel);
  const allIds = await prisma.hotel.findMany({ select: { id: true } });
  console.log('All IDs:', allIds.map(h => h.id).sort((a, b) => a - b));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
