const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ FINAL CORS FIX
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://hotel-booking-rh7rf78mb-harshwadhwa808-8231s-projects.vercel.app',
        'https://hotel-booking-uinl-frontend.vercel.app',
        'https://hotel-booking-alpha-ivory.vercel.app' // ✅ YOUR CURRENT LIVE FRONTEND
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

// ✅ Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ✅ Health check
app.get('/health', (req, res) => {
    res.status(200).send('API is running correctly');
});

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

// ✅ PRODUCTION STATIC SERVE
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running in development mode');
    });
}

// ✅ PORT FIX (Render compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});