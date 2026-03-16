const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDetails() {
    try {
        const hotels = await prisma.hotel.findMany({
            select: { id: true, name: true, images: true }
        });
        console.log('Hotel Image Data:');
        hotels.forEach(h => {
            console.log(`ID: ${h.id}, Name: ${h.name}, Images: ${JSON.stringify(h.images)}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

checkDetails();
