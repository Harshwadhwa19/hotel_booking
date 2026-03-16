const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    include: { hotel: true, user: true }
  });
  console.log('--- ALL BOOKINGS ---');
  console.log(JSON.stringify(bookings, null, 2));
  console.log('Total bookings:', bookings.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
