const { body, validationResult } = require('express-validator');

// Supprime tout retour chariot/saut de ligne d'une chaîne — défense en
// profondeur contre l'injection d'en-têtes email, en complément de la
// protection déjà native à Nodemailer sur les champs standards.
const stripNewlines = (value) => value.replace(/[\r\n]+/g, ' ');

const contactValidationRules = [
  body('nom')
    .trim()
    .customSanitizer(stripNewlines)
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ max: 100 }).withMessage('Le nom est trop long'),
  body('email')
    .trim()
    .isEmail().withMessage('Adresse email invalide')
    .normalizeEmail(),
  body('objet')
    .trim()
    .customSanitizer(stripNewlines)
    .notEmpty().withMessage('L\'objet est requis')
    .isLength({ max: 150 }).withMessage('L\'objet est trop long'),
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ max: 2000 }).withMessage('Le message est trop long (2000 caractères max)'),
];

const checkContactValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { contactValidationRules, checkContactValidation };
