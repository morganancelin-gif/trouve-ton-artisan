const express = require('express');
const router = express.Router();
const {
  getArtisans,
  getTopArtisans,
  getArtisanById,
} = require('../controllers/artisanController');

// ⚠️ /top doit être déclarée AVANT /:id, sinon Express interprète "top" comme un id
router.get('/top', getTopArtisans);
router.get('/:id', getArtisanById);
router.get('/', getArtisans);

module.exports = router;
