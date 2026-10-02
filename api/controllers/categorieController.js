const { Categorie } = require('../models');

// GET /api/categories
// Alimente les 4 liens du menu du header, directement depuis la base
const getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      attributes: ['id_categorie', 'nom'],
      order: [['id_categorie', 'ASC']],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAllCategories };
