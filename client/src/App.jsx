import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArtisanList from './pages/ArtisanList';
import ArtisanDetail from './pages/ArtisanDetail';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      {/* Lien d'évitement WCAG (critère 2.4.1) : permet à un utilisateur
          clavier de sauter directement au contenu sans repasser par tout le menu */}
      <a href="#main-content" className="visually-hidden-focusable">
        Aller au contenu principal
      </a>

      <div className="d-flex flex-column min-vh-100">
        <Header />

        <main id="main-content" className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artisans" element={<ArtisanList />} />
            <Route path="/artisan/:id" element={<ArtisanDetail />} />
            <Route path="/mentions-legales" element={<Legal title="Mentions légales" />} />
            <Route path="/donnees-personnelles" element={<Legal title="Données personnelles" />} />
            <Route path="/accessibilite" element={<Legal title="Accessibilité" />} />
            <Route path="/cookies" element={<Legal title="Cookies" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
