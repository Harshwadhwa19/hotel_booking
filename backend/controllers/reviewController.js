const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res) => {
    const { hotelId, comment, rating } = req.body;
    
    // Improved logic to get userName:
    // 1. If req.user.name exists (some apps include it in payload)
    // 2. Otherwise, check req.body.userName (frontend can send it explicitly)
    // 3. Last fallback: 'Anonymous'
    const userName = (req.user && req.user.name) ? req.user.name : (req.body.userName || 'Anonymous');

    try {
        const review = await prisma.review.create({
            data: {
                hotelId: parseInt(hotelId),
                userName: userName,
                comment: comment,
                rating: parseFloat(rating)
            }
        });

        res.status(201).json(review);
    } catch (err) {
        console.error('Review creation error:', err.message);
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
