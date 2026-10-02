import { useState } from 'react';
import api from '../services/api';

const initialForm = { nom: '', email: '', objet: '', message: '' };

function ContactForm({ artisanId }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      await api.post(`/contact/${artisanId}`, form);
      setStatus('success');
      setForm(initialForm);
    } catch (error) {
      setStatus('error');
      // Les erreurs de validation renvoyées par express-validator sont
      // un tableau ; on affiche la première pour rester simple et clair.
      const apiMessage = error.response?.data?.errors?.[0]?.msg
        || error.response?.data?.message
        || "Une erreur est survenue, merci de réessayer.";
      setErrorMessage(apiMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      <div className="mb-3">
        <label htmlFor="contact-nom" className="form-label">Nom</label>
        <input
          type="text"
          id="contact-nom"
          name="nom"
          className="form-control"
          value={form.nom}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-email" className="form-label">Email</label>
        <input
          type="email"
          id="contact-email"
          name="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-objet" className="form-label">Objet</label>
        <input
          type="text"
          id="contact-objet"
          name="objet"
          className="form-control"
          value={form.objet}
          onChange={handleChange}
          required
          maxLength={150}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-message" className="form-label">Message</label>
        <textarea
          id="contact-message"
          name="message"
          className="form-control"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
          maxLength={2000}
        />
      </div>

      {/* aria-live : annonce automatiquement le résultat de l'envoi aux
          lecteurs d'écran, sans que l'utilisateur ait besoin de chercher
          où regarder sur la page */}
      <div aria-live="polite">
        {status === 'success' && (
          <p className="text-success" style={{ color: '#82b864' }}>
            Votre message a bien été envoyé. L'artisan vous répondra sous 48h.
          </p>
        )}
        {status === 'error' && (
          <p className="text-danger" style={{ color: '#cd2c2e' }} role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>
    </form>
  );
}

export default ContactForm;
