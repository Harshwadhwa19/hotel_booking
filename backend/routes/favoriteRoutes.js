const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

router.post('/toggle', auth, favoriteController.toggleFavorite);
router.get('/user', auth, favoriteController.getUserFavorites);
router.get('/check/:hotelId', auth, favoriteController.checkFavorite);

module.exports = router;
