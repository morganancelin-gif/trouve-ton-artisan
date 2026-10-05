require('dotenv').config();

// ============================================
// Filet de sécurité global : capture absolument TOUTE erreur,
// même celle survenant pendant le chargement d'un module (require),
// et garantit que le message est bien écrit avant que le processus
// ne se termine (évite la perte de logs liée à l'écriture asynchrone
// de stdout dans un environnement non-interactif comme Render).
// ============================================
function exitWithLog(message) {
  process.stderr.write(`${message}\n`, () => {
    process.exit(1);
  });
}

process.on('uncaughtException', (error) => {
  exitWithLog(`❌ Exception non interceptée : ${error.stack || error.message}`);
});

process.on('unhandledRejection', (reason) => {
  exitWithLog(`❌ Promesse rejetée non gérée : ${reason}`);
});

// Diagnostic affiché EN TOUT PREMIER, avant même de charger le module
// de connexion à la base — s'il ne s'affiche pas, le crash est encore
// plus précoce (dotenv lui-même, ou une erreur de syntaxe).
console.log('--- Diagnostic variables d\'environnement ---');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD définie ?', Boolean(process.env.DB_PASSWORD));
console.log('DB_SSL:', process.env.DB_SSL);
console.log('DB_SSL_CA_BASE64 longueur:', (process.env.DB_SSL_CA_BASE64 || '').length);
console.log('----------------------------------------------');

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
    exitWithLog(`❌ Impossible de se connecter à la base : ${error.message}`);
  });
