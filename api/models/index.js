const Categorie = require('./Categorie');
const Specialite = require('./Specialite');
const Artisan = require('./Artisan');

// Une catégorie a plusieurs spécialités ; une spécialité appartient à une catégorie
Categorie.hasMany(Specialite, { foreignKey: 'id_categorie' });
Specialite.belongsTo(Categorie, { foreignKey: 'id_categorie' });

// Une spécialité a plusieurs artisans ; un artisan appartient à une spécialité
Specialite.hasMany(Artisan, { foreignKey: 'id_specialite' });
Artisan.belongsTo(Specialite, { foreignKey: 'id_specialite' });

module.exports = { Categorie, Specialite, Artisan };
