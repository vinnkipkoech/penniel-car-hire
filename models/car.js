const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Car', carSchema);