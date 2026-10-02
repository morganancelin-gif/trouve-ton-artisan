import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/Logo.png';

function Header() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Les liens du menu sont alimentés depuis la base de données,
  // conformément au brief — jamais codés en dur dans le composant.
  useEffect(() => {
    api.get('/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Erreur chargement catégories :', error));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/artisans?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#00497c' }}>
        <div className="container-fluid">

          <Link className="navbar-brand" to="/">
            <div className="bg-white rounded px-2 py-1 d-inline-flex align-items-center">
              <img src={logo} alt="Trouve ton artisan - retour à l'accueil" height="28" />
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Ouvrir le menu de navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {categories.map((categorie) => (
                <li className="nav-item" key={categorie.id_categorie}>
                  <Link
                    className="nav-link"
                    to={`/artisans?categorie=${encodeURIComponent(categorie.nom)}`}
                  >
                    {categorie.nom}
                  </Link>
                </li>
              ))}
            </ul>

            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <label htmlFor="search-artisan" className="visually-hidden">
                Rechercher un artisan par nom
              </label>
              <input
                id="search-artisan"
                type="search"
                className="form-control me-2"
                placeholder="Nom de l'artisan"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="btn btn-light" type="submit">
                Rechercher
              </button>
            </form>
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Header;
