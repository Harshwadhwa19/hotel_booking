const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const coupons = [
    { code: 'GRAND10', discountPercentage: 10, expiryDate: new Date('2026-12-31') },
    { code: 'LUXURY20', discountPercentage: 20, expiryDate: new Date('2026-12-31') },
    { code: 'WELCOME50', discountPercentage: 50, expiryDate: new Date('2026-12-31') }
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c
    });
  }
  console.log('Coupons seeded successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
