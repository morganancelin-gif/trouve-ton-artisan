require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');

const categorieRoutes = require('./routes/categorieRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// --- Diagnostic temporaire : confirme ce que Render a réellement reçu,
// sans jamais afficher les valeurs sensibles elles-mêmes (juste leur longueur).
console.log('--- Diagnostic variables d\'environnement ---');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_SSL:', process.env.DB_SSL);
console.log('DB_SSL_CA_BASE64 longueur:', (process.env.DB_SSL_CA_BASE64 || '').length);
console.log('----------------------------------------------');

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, methods: ['GET', 'POST'] }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Trop de requêtes, réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/categories', categorieRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 4000;

// Timeout manuel de 10 secondes : si la connexion à la base n'aboutit pas
// dans ce délai, on échoue bruyamment avec un message clair plutôt que
// de rester bloqué en silence jusqu'à ce que Render tue le processus.
const authenticateWithTimeout = Promise.race([
  sequelize.authenticate(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout : connexion DB non résolue après 10s')), 10000)
  ),
]);

authenticateWithTimeout
  .then(() => {
    console.log('✅ Connexion à MySQL réussie (Sequelize)');
    app.listen(PORT, () => {
      console.log(`🚀 API lancée sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Impossible de se connecter à la base :', error.message);
    process.exit(1);
  });
