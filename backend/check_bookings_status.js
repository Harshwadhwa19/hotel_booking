const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: true, hotel: true }
        });

        console.log('Recent Bookings:');
        bookings.forEach(b => {
            console.log(`ID: ${b.id}, Hotel: ${b.hotel.name}, User: ${b.user.email}, Status: ${b.bookingStatus}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

checkBookings();
