const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Specialite = sequelize.define('Specialite', {
  id_specialite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  id_categorie: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'specialite',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Specialite;
