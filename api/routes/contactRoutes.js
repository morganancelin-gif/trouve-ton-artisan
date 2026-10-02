const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contactController');
const {
  contactValidationRules,
  checkContactValidation,
} = require('../middlewares/validateContact');

router.post('/:id', contactValidationRules, checkContactValidation, sendContactMessage);

module.exports = router;
