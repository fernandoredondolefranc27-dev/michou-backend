const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des avis.' });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { author, role, quote, rating } = req.body;

    if (!author || !quote) {
      return res.status(400).json({ message: 'L’auteur et le message sont obligatoires.' });
    }

    const formattedAuthor = author.toUpperCase().startsWith('CLIENT') 
      ? author 
      : `CLIENT(E) ${author.toUpperCase()}`;

    const newTestimonial = new Testimonial({
      author: formattedAuthor,
      role: role || 'Service Studio',
      quote,
      rating: Number(rating) || 5
    });

    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l’avis.' });
  }
};