import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 fw-bold" style={{ color: '#0074c7' }}>404</h1>
      <p className="fs-4 mb-4">La page que vous avez demandée n'existe pas.</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </div>
  );
}

export default NotFound;
