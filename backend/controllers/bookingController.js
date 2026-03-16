const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

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
        const booking = await prisma.booking.update({
            where: { id: parseInt(req.params.id) },
            data: { bookingStatus: 'Cancelled' }
        });
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
