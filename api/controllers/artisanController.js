const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Artisan, Specialite, Categorie } = require('../models');

// Inclusion commune : à chaque artisan, on joint sa spécialité et la catégorie de celle-ci
const includeRelations = {
  include: [{
    model: Specialite,
    attributes: ['nom'],
    include: [{ model: Categorie, attributes: ['nom'] }],
  }],
};

// GET /api/artisans?categorie=Bâtiment&q=dumont
// Liste des artisans, filtrable par catégorie et/ou recherche sur le nom OU la spécialité
const getArtisans = async (req, res) => {
  try {
    const { categorie, q } = req.query;

    // required: true à chaque niveau : force un INNER JOIN pour que le
    // where posé sur Categorie filtre effectivement les artisans, même
    // à travers une association imbriquée à deux niveaux.
    const specialiteInclude = {
      model: Specialite,
      attributes: ['nom'],
      required: true,
      include: [{
        model: Categorie,
        attributes: ['nom'],
        required: true,
      }],
    };

    if (categorie) {
      specialiteInclude.include[0].where = { nom: categorie };
    }

    // La recherche porte à la fois sur le nom de l'artisan et sur le nom
    // de sa spécialité (ex : "coiff" doit retrouver les coiffeurs même si
    // aucun d'eux ne s'appelle littéralement "Coiffeur").
    // sequelize.col('Specialite.nom') référence explicitement la colonne
    // de la table jointe, nécessaire ici car elle vit dans une autre table
    // que celle sur laquelle porte la requête principale (Artisan).
    const where = q
      ? {
          [Op.or]: [
            { nom: { [Op.like]: `%${q}%` } },
            sequelize.where(sequelize.col('Specialite.nom'), { [Op.like]: `%${q}%` }),
          ],
        }
      : {};

    const artisans = await Artisan.findAll({
      attributes: ['id_artisan', 'nom', 'note', 'ville'],
      where,
      include: [specialiteInclude],
      order: [['nom', 'ASC']],
    });

    res.status(200).json(artisans);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/artisans/top
// Les 3 artisans du mois pour la page d'accueil
const getTopArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.findAll({
      attributes: ['id_artisan', 'nom', 'note', 'ville'],
      where: { top: true },
      ...includeRelations,
    });
    res.status(200).json(artisans);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/artisans/:id
// Fiche complète d'un artisan (sans exposer son email brut, voir note sécurité)
const getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id, {
      attributes: ['id_artisan', 'nom', 'note', 'ville', 'a_propos', 'site_web'],
      ...includeRelations,
    });

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    res.status(200).json(artisan);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getArtisans, getTopArtisans, getArtisanById };
