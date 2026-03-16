const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.applyCoupon = async (req, res) => {
    const { code } = req.body;

    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        // Check expiry
        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        res.json({
            message: 'Coupon applied successfully!',
            discountPercentage: coupon.discountPercentage
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Admin helper to seed coupons if needed
exports.createCoupon = async (req, res) => {
    const { code, discountPercentage, expiryDate } = req.body;
    try {
        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountPercentage: parseFloat(discountPercentage),
                expiryDate: new Date(expiryDate)
            }
        });
        res.status(201).json(coupon);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
