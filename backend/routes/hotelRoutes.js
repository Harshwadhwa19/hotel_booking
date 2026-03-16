const express = require('express');
const router = express.Router();
const { getHotels, getHotelById, searchHotels, filterHotels } = require('../controllers/hotelController');

router.get('/', getHotels);
router.get('/search', searchHotels);
router.get('/filter', filterHotels);
router.get('/:id', getHotelById);

module.exports = router;
