const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../services/emailService');

exports.createOrder = async (req, res) => {
    const { bookingId, amount } = req.body;
    try {
        // In a real app, you'd call Razorpay/Stripe here
        // We simulate a successful order creation
        const orderId = `order_${Math.random().toString(36).substr(2, 9)}`;
        res.json({ orderId, amount, currency: 'INR' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const { createNotification } = require('./notificationController');

exports.verifyPayment = async (req, res) => {
    const { bookingId, amount, transactionId, status } = req.body;
    const userId = req.user.id;

    try {
        // 1. Create Payment Record
        const payment = await prisma.payment.create({
            data: {
                bookingId: parseInt(bookingId),
                userId,
                paymentAmount: parseFloat(amount),
                paymentStatus: status || 'Completed',
                transactionId: transactionId || `txn_${Date.now()}`
            }
        });

        // 2. Update Booking Status if payment successful
        if (status === 'Completed' || !status) {
            await prisma.booking.update({
                where: { id: parseInt(bookingId) },
                data: { bookingStatus: 'Confirmed' }
            });

            // 3. Create Notification
            await createNotification(userId, `Your booking for ID #${bookingId} has been confirmed! Enjoy your stay.`);

            // 4. Send Confirmation Email
            try {
                const bookingDetails = await prisma.booking.findUnique({
                    where: { id: parseInt(bookingId) },
                    include: {
                        hotel: true,
                        user: true
                    }
                });

                if (bookingDetails && bookingDetails.user.email) {
                    const subject = 'Booking Confirmed - Grand Hotel';
                    const message = `
Hi ${bookingDetails.user.name},

Your booking has been confirmed!

Booking Details:
- Hotel: ${bookingDetails.hotel.name}
- Location: ${bookingDetails.hotel.location}, ${bookingDetails.hotel.city}
- Check-in: ${new Date(bookingDetails.checkInDate).toLocaleDateString()}
- Check-out: ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}
- Guests: ${bookingDetails.guestsCount}
- Room Type: ${bookingDetails.roomType}
- Total Price: ₹${bookingDetails.totalPrice.toLocaleString()}

Thank you for choosing Grand Hotel!
                    `;
                    await sendEmail(bookingDetails.user.email, subject, message);
                }
            } catch (emailErr) {
                console.error('Failed to send confirmation email:', emailErr.message);
            }
        }

        res.json({ msg: 'Payment verified and booking confirmed', payment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
