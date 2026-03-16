const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const auth = require('../middleware/auth');

router.post('/apply', auth, couponController.applyCoupon);
router.post('/create', auth, couponController.createCoupon); // Protected admin-like route

module.exports = router;
