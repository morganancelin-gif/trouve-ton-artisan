import { Link } from 'react-router-dom';
import StarRating from './StarRating';

function ArtisanCard({ artisan }) {
  const specialite = artisan.Specialite?.nom;

  return (
    <Link
      to={`/artisan/${artisan.id_artisan}`}
      className="text-decoration-none d-block h-100"
    >
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h3 className="h5 card-title" style={{ color: '#384050' }}>{artisan.nom}</h3>
          <StarRating note={artisan.note} />
          {specialite && (
            <p className="mb-1 mt-2 fw-bold" style={{ color: '#0074c7' }}>{specialite}</p>
          )}
          <p className="mb-0 text-secondary small">{artisan.ville}</p>
        </div>
      </div>
    </Link>
  );
}

export default ArtisanCard;
