const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// POST /api/reviews - Anyone logged in can review
router.post('/', auth, reviewController.createReview);

// GET /api/reviews/:hotelId - Public can see reviews
router.get('/:hotelId', reviewController.getHotelReviews);

module.exports = router;
