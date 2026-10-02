import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import usePageMeta from '../hooks/usePageMeta';

function ArtisanList() {
  const [searchParams] = useSearchParams();
  const categorie = searchParams.get('categorie');
  const q = searchParams.get('q');

  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Titre dynamique selon le contexte (catégorie, recherche, ou liste complète)
  const pageTitle = categorie
    ? `Artisans — ${categorie}`
    : q
      ? `Résultats pour "${q}"`
      : 'Tous les artisans';

  usePageMeta(
    `${pageTitle} — Trouve ton artisan`,
    `Découvrez les artisans de la région Auvergne-Rhône-Alpes${categorie ? ` dans la catégorie ${categorie}` : ''}.`
  );

 useEffect(() => {
    // Réinitialisation volontaire de l'état avant un fetch dépendant de la
    // catégorie/recherche : même justification que dans ArtisanDetail.jsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    const params = {};
    if (categorie) params.categorie = categorie;
    if (q) params.q = q;

    api.get('/artisans', { params })
      .then((response) => setArtisans(response.data))
      .catch(() => setError("Impossible de charger les artisans pour le moment."))
      .finally(() => setLoading(false));
  }, [categorie, q]);

  return (
    <div className="container py-5">
      <h1 className="h2 mb-4" style={{ color: '#384050' }}>{pageTitle}</h1>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-danger" role="alert">{error}</p>}

      {!loading && !error && artisans.length === 0 && (
        <p>Aucun artisan ne correspond à votre recherche.</p>
      )}

      {!loading && !error && artisans.length > 0 && (
        <div className="row g-4" role="list">
          {artisans.map((artisan) => (
            <div className="col-sm-6 col-lg-4" key={artisan.id_artisan} role="listitem">
              <ArtisanCard artisan={artisan} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtisanList;
