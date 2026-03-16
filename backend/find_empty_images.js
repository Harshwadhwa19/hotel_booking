const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findEmpty() {
    try {
        const hotels = await prisma.hotel.findMany({
            where: {
                OR: [
                    { images: { equals: [] } },
                    { images: { has: '' } }
                ]
            },
            select: { id: true, name: true, images: true }
        });
        console.log(`Found ${hotels.length} hotels with missing/empty images.`);
        hotels.forEach(h => {
            console.log(`ID: ${h.id}, Name: ${h.name}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

findEmpty();
