const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getHotels = async (req, res) => {
    try {
        const hotels = await prisma.hotel.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getHotelById = async (req, res) => {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json(hotel);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.searchHotels = async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json(await prisma.hotel.findMany({ orderBy: { rating: 'desc' } }));
    
    try {
        const hotels = await prisma.hotel.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                    { city: { contains: query, mode: 'insensitive' } }
                ]
            }
        });
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.filterHotels = async (req, res) => {
    const { priceRange, category, rating, query } = req.query;
    let where = {};

    // Integrate search query if present
    if (query) {
        where.AND = [
            {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                    { city: { contains: query, mode: 'insensitive' } }
                ]
            }
        ];
    }

    if (priceRange && priceRange !== 'Any') {
        const parts = priceRange.split('-');
        if (parts.length === 2) {
            const min = Number(parts[0]);
            const max = Number(parts[1]);
            if (!isNaN(min) && !isNaN(max)) {
                where.pricePerNight = { gte: min, lte: max };
            }
        }
    }

    if (category && category !== 'All') {
        where.category = { equals: category, mode: 'insensitive' };
    }

    if (rating && rating !== '0' && rating !== 'Any') {
        where.rating = { gte: parseFloat(rating) };
    }

    try {
        const hotels = await prisma.hotel.findMany({ where });
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
