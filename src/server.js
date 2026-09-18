require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Vérification de sécurité de la variable d'environnement
if (!process.env.MONGO_URI) {
  console.error("ERREUR FATALE : La variable MONGO_URI n'est pas définie dans le fichier .env");
  process.exit(1);
}

// Connexion sécurisée à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
  .catch((err) => console.error('Erreur de connexion MongoDB :', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API (logique conservée intacte)
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('API Michou Studio - Opérationnel');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});