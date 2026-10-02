const nodemailer = require('nodemailer');
const { Artisan } = require('../models');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/contact/:id
// Envoie un email à l'artisan :id, à partir des données validées du formulaire
const sendContactMessage = async (req, res) => {
  try {
    const { nom, email, objet, message } = req.body;

    const artisan = await Artisan.findByPk(req.params.id, {
      attributes: ['email', 'nom'],
    });

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    await transporter.sendMail({
      from: `"Trouve ton artisan" <${process.env.SMTP_USER}>`,
      to: artisan.email,
      replyTo: email,
      subject: `[Trouve ton artisan] ${objet}`,
      text: `Message de ${nom} (${email}) :\n\n${message}`,
    });

    res.status(200).json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi', error: error.message });
  }
};

module.exports = { sendContactMessage };
