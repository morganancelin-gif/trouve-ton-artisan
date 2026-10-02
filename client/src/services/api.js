import axios from 'axios';

// Instance axios unique, configurée avec l'URL de l'API définie dans .env.
// Centraliser ça ici évite de répéter la baseURL dans chaque composant,
// et facilite le changement d'environnement (dev → production) en un seul endroit.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
