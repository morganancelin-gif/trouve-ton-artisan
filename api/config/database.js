const { Sequelize } = require('sequelize');
require('dotenv').config();

// En production (Aiven), la connexion doit être chiffrée (SSL) et vérifiée
// via le certificat CA fourni par l'hébergeur. En local (XAMPP), DB_SSL
// n'est simplement pas défini, donc aucune option SSL n'est appliquée.
const sslOptions = process.env.DB_SSL === 'true'
  ? {
      ssl: {
        ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf-8'),
        rejectUnauthorized: true,
      },
    }
  : {};

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
