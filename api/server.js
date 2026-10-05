require('dotenv').config();

// Filet de sécurité global : capture toute erreur même pendant le
// chargement d'un module, et garantit que le message est bien écrit
// avant l'arrêt du processus (utile en environnement de production
// comme Render, où l'écriture des logs peut être asynchrone).
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
