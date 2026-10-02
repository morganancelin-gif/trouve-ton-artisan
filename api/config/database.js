const { Sequelize } = require('sequelize');
require('dotenv').config();

// Instance Sequelize connectée à la base MySQL "artisan_db",
// avec l'utilisateur dédié "artisan_app" (pas root : principe de moindre privilège)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // passe à console.log pour déboguer les requêtes SQL générées
  }
);

module.exports = sequelize;
