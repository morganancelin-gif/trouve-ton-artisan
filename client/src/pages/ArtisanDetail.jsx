import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import StarRating from '../components/StarRating';
import ContactForm from '../components/ContactForm';
import NotFound from './NotFound';
import usePageMeta from '../hooks/usePageMeta';

function ArtisanDetail() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Le titre dépend des données chargées : on ne peut l'appeler qu'une
  // fois l'artisan connu (ou avec un intitulé neutre pendant le chargement)
  usePageMeta(
    artisan ? `${artisan.nom} — Trouve ton artisan` : 'Trouve ton artisan',
    artisan ? `Contactez ${artisan.nom}, ${artisan.Specialite?.nom} à ${artisan.ville}.` : ''
  );

  useEffect(() => {
    // Réinitialisation volontaire de l'état avant un fetch dépendant de l'id :
    // pattern standard de chargement de données. La règle react-hooks/set-state-in-effect
    // est très récente (liée au futur React Compiler) et son "vrai" correctif
    // demanderait une lib de data-fetching, hors scope de ce projet.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setNotFound(false);

    api.get(`/artisans/${id}`)
      .then((response) => setArtisan(response.data))
      .catch((error) => {
        if (error.response?.status === 404) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container py-5"><p>Chargement…</p></div>;
  }

  if (notFound || !artisan) {
    return <NotFound />;
  }

  // Initiales utilisées comme avatar de substitution : aucune photo
  // n'étant fournie dans le jeu de données, on affiche un repère visuel
  // simple plutôt qu'un cadre vide ou une image cassée.
  const initials = artisan.nom
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="container py-5">
      <div className="row g-5">

        <div className="col-lg-5">
          <div
            className="rounded d-flex align-items-center justify-content-center mb-4"
            style={{ aspectRatio: '1', backgroundColor: '#f1f8fc', color: '#0074c7' }}
            role="img"
            aria-label={`Photo de ${artisan.nom}`}
          >
            <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{initials}</span>
          </div>
        </div>

        <div className="col-lg-7">
          <h1 className="mb-2" style={{ color: '#384050' }}>{artisan.nom}</h1>

          <div className="mb-3">
            <StarRating note={artisan.note} />
          </div>

          <p className="fw-bold mb-1" style={{ color: '#0074c7' }}>
            {artisan.Specialite?.nom}
          </p>
          <p className="text-secondary mb-4">{artisan.ville}</p>

          <h2 className="h5">À propos</h2>
          <p className="mb-4">{artisan.a_propos}</p>

          {artisan.site_web && (
            <p className="mb-4">
              <a href={artisan.site_web} target="_blank" rel="noopener noreferrer">
                Visiter le site web de {artisan.nom}
              </a>
              <span className="visually-hidden"> (ouvre un nouvel onglet)</span>
            </p>
          )}

          <h2 className="h5 mb-3">Contacter {artisan.nom}</h2>
          <ContactForm artisanId={artisan.id_artisan} />
        </div>

      </div>
    </div>
  );
}

export default ArtisanDetail;
