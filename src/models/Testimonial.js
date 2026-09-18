const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: { type: String, default: '' },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);