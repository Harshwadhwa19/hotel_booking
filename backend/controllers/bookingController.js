const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});
const { sendEmail } = require('../services/emailService');
const { createNotification } = require('./notificationController');

exports.createBooking = async (req, res) => {
    console.log('--- NEW BOOKING REQUEST ---');
    console.log('Body:', req.body);
    console.log('User:', req.user);
    const { hotelId, checkInDate, checkOutDate, guestsCount, roomType, totalPrice, serviceFee, cleaningFee } = req.body;
    const userId = req.user.id;

    try {
        const booking = await prisma.booking.create({
            data: {
                userId,
                hotelId: parseInt(hotelId),
                checkInDate: new Date(checkInDate),
                checkOutDate: new Date(checkOutDate),
                guestsCount: parseInt(guestsCount),
                roomType,
                totalPrice: parseFloat(totalPrice),
                serviceFee: parseFloat(serviceFee),
                cleaningFee: parseFloat(cleaningFee),
                bookingStatus: 'Pending'
            }
        });
        console.log('Booking created successfully:', booking.id);
        res.status(201).json(booking);
    } catch (err) {
        console.error('Booking creation failed:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: { hotel: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.id);
        
        // 1. Update status to 'Cancelled'
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { bookingStatus: 'Cancelled' },
            include: {
                hotel: true,
                user: true
            }
        });
        
        // 2. Create Notification
        await createNotification(booking.userId, `Your booking for ID #${bookingId} has been cancelled.`);

        // 2. Send Cancellation Email
        console.log(`[CANCELLATION] Attempting email for booking #${bookingId} to ${booking.user.email}`);
        if (booking.user && booking.user.email) {
            try {
                const subject = `Booking Cancelled - ${booking.hotel.name}`;
                const message = `
Hi ${booking.user.name},

Your booking for ${booking.hotel.name} has been successfully cancelled as per your request.

Booking Details:
- Booking ID: #${booking.id}
- Hotel: ${booking.hotel.name}
- Location: ${booking.hotel.location}, ${booking.hotel.city}
- Dates: ${new Date(booking.checkInDate).toLocaleDateString()} to ${new Date(booking.checkOutDate).toLocaleDateString()}

If this wasn't you, please contact our support immediately.

We hope to see you again soon!
                `;
                await sendEmail(booking.user.email, subject, message);
                console.log(`[CANCELLATION] Email sent successfully to ${booking.user.email}`);
            } catch (emailErr) {
                console.error('[CANCELLATION] Failed to send email:', emailErr.message);
            }
        } else {
            console.log(`[CANCELLATION] No user email found for booking #${bookingId}`);
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
