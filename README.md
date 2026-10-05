# Trouve ton artisan

Plateforme de mise en relation entre particuliers et artisans de la région
Auvergne-Rhône-Alpes, développée pour le compte de la région.

## Stack technique

- **Frontend** : React (Vite), React Router, Bootstrap 5, Sass
- **API** : Node.js, Express, Sequelize
- **Base de données** : MySQL (MariaDB en local via XAMPP, Aiven en production)
- **Sécurité** : Helmet, CORS restreint, rate limiting, validation des entrées (express-validator)

## Prérequis

- Node.js 18+ et npm
- MySQL ou MariaDB (XAMPP recommandé en local)
- Un compte SMTP (Ethereal pour les tests, ou un vrai service en production) pour l'envoi d'emails

## Installation

### 1. Cloner le dépôt

\`\`\`bash
git clone https://github.com/morganancelin-gif/trouve-ton-artisan.git
cd trouve-ton-artisan
\`\`\`

### 2. Base de données

Créer la base et un utilisateur dédié :

\`\`\`sql
CREATE DATABASE artisan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'artisan_app'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON artisan_db.* TO 'artisan_app'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

Importer le schéma et les données :

\`\`\`bash
mysql -u artisan_app -p artisan_db < sql/01_schema.sql
mysql -u artisan_app -p artisan_db < sql/02_data.sql
\`\`\`

### 3. API

\`\`\`bash
cd api
npm install
\`\`\`

Créer un fichier \`.env\` dans \`api/\` :

\`\`\`
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=artisan_db
DB_USER=artisan_app
DB_PASSWORD=votre_mot_de_passe
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=votre_user_smtp
SMTP_PASS=votre_pass_smtp
\`\`\`

Lancer l'API :

\`\`\`bash
npm run dev
\`\`\`

L'API est disponible sur http://localhost:4000

### 4. Frontend

\`\`\`bash
cd ../client
npm install
\`\`\`

Créer un fichier \`.env\` dans \`client/\` :

\`\`\`
VITE_API_URL=http://localhost:4000/api
\`\`\`

Lancer le frontend :

\`\`\`bash
npm run dev
\`\`\`

Le site est disponible sur http://localhost:5173

## Déploiement

- **API** : hébergée sur Render (Web Service), connectée à une base MySQL managée sur Aiven
- **Frontend** : hébergé sur Render (Static Site)
- **Site en ligne** : https://trouve-ton-artisan-1-4jsk.onrender.com
- **API en ligne** : https://trouve-ton-artisan-ugjv.onrender.com

## Structure du projet

\`\`\`
trouve-ton-artisan/
├── api/          → API Node/Express/Sequelize
├── client/       → Frontend React (Vite)
├── sql/          → Scripts SQL (schéma + peuplement)
└── README.md
\`\`\`
