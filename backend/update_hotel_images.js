const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
];

async function updateRecords() {
    try {
        const hotels = await prisma.hotel.findMany();
        console.log(`Checking ${hotels.length} hotels...`);

        for (let i = 0; i < hotels.length; i++) {
            const h = hotels[i];
            // If images array is empty or the first image looks suspicious (not a real Unsplash URL or specifically requested to be updated)
            if (!h.images || h.images.length === 0 || !h.images[0].startsWith('https://images.unsplash.com')) {
                console.log(`Updating images for: ${h.name}`);
                const randomImage = validImages[Math.floor(Math.random() * validImages.length)];
                await prisma.hotel.update({
                    where: { id: h.id },
                    data: {
                        images: [randomImage]
                    }
                });
            }
        }
        console.log('Update finished.');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

updateRecords();
