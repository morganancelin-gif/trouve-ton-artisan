import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="text-white mt-auto" style={{ backgroundColor: '#384050' }}>
      <div className="container py-4">
        <div className="row">

          <div className="col-md-6 mb-3 mb-md-0">
            <nav aria-label="Liens légaux">
              <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
                <li><Link to="/mentions-legales" className="text-white text-decoration-underline">Mentions légales</Link></li>
                <li><Link to="/donnees-personnelles" className="text-white text-decoration-underline">Données personnelles</Link></li>
                <li><Link to="/accessibilite" className="text-white text-decoration-underline">Accessibilité</Link></li>
                <li><Link to="/cookies" className="text-white text-decoration-underline">Cookies</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-md-6">
            <address className="mb-0 small" style={{ fontStyle: 'normal' }}>
              Région Auvergne-Rhône-Alpes — Antenne de Lyon<br />
              101 cours Charlemagne<br />
              CS 20033<br />
              69269 Lyon Cedex 02, France<br />
              <a href="tel:+33426734000" className="text-white">+33 (0)4 26 73 40 00</a>
            </address>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
