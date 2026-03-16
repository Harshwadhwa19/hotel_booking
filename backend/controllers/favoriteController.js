const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.toggleFavorite = async (req, res) => {
    const { hotelId } = req.body;
    const userId = req.user.id;

    try {
        const existing = await prisma.favorite.findFirst({
            where: {
                userId,
                hotelId: parseInt(hotelId)
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            return res.json({ message: 'Removed from favorites', saved: false });
        } else {
            const favorite = await prisma.favorite.create({
                data: {
                    userId,
                    hotelId: parseInt(hotelId)
                }
            });
            return res.status(201).json({ message: 'Added to favorites', saved: true, favorite });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            include: { hotel: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(favorites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const favorite = await prisma.favorite.findFirst({
            where: {
                userId: req.user.id,
                hotelId: parseInt(req.params.hotelId)
            }
        });
        res.json({ isFavorite: !!favorite });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
