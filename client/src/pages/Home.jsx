import { useState, useEffect } from 'react';
import api from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import usePageMeta from '../hooks/usePageMeta';

// Texte des 4 étapes, tel qu'imposé par le brief (numéro + texte obligatoires)
const steps = [
  "Choisir la catégorie d'artisanat dans le menu.",
  "Choisir un artisan.",
  "Le contacter via le formulaire de contact.",
  "Une réponse sera apportée sous 48h.",
];

function Home() {
  const [topArtisans, setTopArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  usePageMeta(
    'Trouve ton artisan — Accueil',
    "Trouvez facilement un artisan de la région Auvergne-Rhône-Alpes et contactez-le directement via notre plateforme."
  );

  useEffect(() => {
    api.get('/artisans/top')
      .then((response) => setTopArtisans(response.data))
      .catch(() => setError("Impossible de charger les artisans du mois pour le moment."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="py-5" style={{ backgroundColor: '#f1f8fc' }}>
        <div className="container">
          <h1 className="mb-2" style={{ color: '#384050' }}>Trouve ton artisan !</h1>
          <p className="fw-bold mb-0" style={{ color: '#0074c7' }}>
            Avec la région Auvergne-Rhône-Alpes
          </p>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="h3 mb-4">Comment trouver mon artisan ?</h2>
        <ol className="list-unstyled row g-4">
          {steps.map((text, index) => (
            <li key={index} className="col-md-6 col-lg-3 d-flex gap-3">
              <span
                className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                style={{ width: '2rem', height: '2rem', backgroundColor: '#0074c7' }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="container pb-5">
        <h2 className="h3 mb-4">Les artisans du mois</h2>

        {loading && <p>Chargement…</p>}
        {error && <p className="text-danger" role="alert">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            {topArtisans.map((artisan) => (
              <div className="col-md-4" key={artisan.id_artisan}>
                <ArtisanCard artisan={artisan} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
