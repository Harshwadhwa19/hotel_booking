const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }]
});

module.exports = mongoose.model('Hotel', HotelSchema);
