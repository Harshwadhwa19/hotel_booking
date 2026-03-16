const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res) => {
    const { hotelId, comment, rating } = req.body;
    // We can get userName from req.user if logged in, or from body
    const userName = req.user ? req.user.name : (req.body.userName || 'Anonymous');

    try {
        const review = await prisma.review.create({
            data: {
                hotelId: parseInt(hotelId),
                userName,
                comment,
                rating: parseFloat(rating)
            }
        });

        // Optional: Update hotel rating (simplified)
        // In a real app, you'd calculate the average
        
        res.status(201).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getHotelReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { hotelId: parseInt(req.params.hotelId) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
