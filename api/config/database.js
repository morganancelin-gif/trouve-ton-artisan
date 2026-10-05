const { Sequelize } = require('sequelize');
require('dotenv').config();

let sslOptions = {};

if (process.env.DB_SSL === 'true') {
  if (!process.env.DB_SSL_CA_BASE64) {
    // Erreur explicite et immédiatement visible dans les logs, plutôt
    // qu'un crash silencieux dans Buffer.from() sans aucune explication.
    console.error('❌ DB_SSL=true mais DB_SSL_CA_BASE64 est vide ou absente.');
    process.exit(1);
  }

  sslOptions = {
    ssl: {
      ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf-8'),
      rejectUnauthorized: true,
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: sslOptions,
    logging: false,
  }
);

module.exports = sequelize;
