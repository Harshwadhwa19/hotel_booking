const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('./services/emailService');

async function testCancel() {
    try {
        // Find a confirmed booking to cancel
        const booking = await prisma.booking.findFirst({
            where: { bookingStatus: 'Confirmed' },
            include: { user: true, hotel: true }
        });

        if (!booking) {
            console.log('No confirmed booking found to test with.');
            return;
        }

        console.log(`Found booking ID: ${booking.id} for user ${booking.user.email}`);

        // Simulate the logic in cancelBooking
        const updatedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: { bookingStatus: 'Cancelled' },
            include: { user: true, hotel: true }
        });

        console.log('Status updated to Cancelled.');

        if (updatedBooking.user && updatedBooking.user.email) {
            console.log(`Attempting to send email to ${updatedBooking.user.email}...`);
            const subject = `DEBUG: Booking Cancelled - ${updatedBooking.hotel.name}`;
            const message = `Testing cancellation email for booking #${updatedBooking.id}`;
            const success = await sendEmail(updatedBooking.user.email, subject, message);
            console.log(`Email sent: ${success}`);
        } else {
            console.log('User or email missing in updated booking.');
        }

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

testCancel();
