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

// --- Sécurité HTTP générale ---
// Ajoute automatiquement des en-têtes qui préviennent des attaques courantes :
// X-Content-Type-Options (anti-sniffing MIME), X-Frame-Options (anti-clickjacking),
// Strict-Transport-Security, et retire l'en-tête "X-Powered-By: Express" qui
// révèle inutilement la techno utilisée à un attaquant potentiel.
app.use(helmet());

// --- CORS restreint à l'application front uniquement ---
// Sans ce réglage, CORS autorise par défaut TOUT site à appeler l'API en JS.
// Ici, seule l'origine définie dans .env (l'app React) est autorisée ;
// toute autre origine reçoit une erreur CORS bloquée par le navigateur.
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
}));

// --- Limitation du nombre de requêtes (anti-spam / anti-brute-force) ---
// Protège contre une exploration automatisée agressive de l'API ou un
// spam du formulaire de contact : 100 requêtes maximum par IP toutes les 15 minutes.
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

sequelize.authenticate()
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
