import { useEffect } from 'react';

// Met à jour le titre de l'onglet et la balise <meta name="description">
// à chaque changement de page — requis par le brief pour le référencement (SEO).
function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [title, description]);
}

export default usePageMeta;
