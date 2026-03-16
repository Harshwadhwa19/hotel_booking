const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createNotification = async (userId, message) => {
    try {
        await prisma.notification.create({
            data: { userId, message }
        });
    } catch (err) {
        console.error('Failed to create notification', err);
    }
};
