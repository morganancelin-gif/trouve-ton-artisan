-- ============================================
-- Schéma de la base de données "artisan_db"
-- Site "Trouve ton artisan"
-- ============================================

USE artisan_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS artisan;
DROP TABLE IF EXISTS specialite;
DROP TABLE IF EXISTS categorie;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Catégorie (ex : Bâtiment, Services, Fabrication, Alimentation)
-- ============================================
CREATE TABLE categorie (
  id_categorie INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Spécialité (ex : Boulanger, Plombier...), rattachée à 1 catégorie
-- ============================================
CREATE TABLE specialite (
  id_specialite INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(50) NOT NULL UNIQUE,
  id_categorie INT NOT NULL,
  CONSTRAINT fk_specialite_categorie
    FOREIGN KEY (id_categorie) REFERENCES categorie(id_categorie)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Artisan, rattaché à 1 spécialité
-- ============================================
CREATE TABLE artisan (
  id_artisan INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  note DECIMAL(2,1) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  a_propos TEXT NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  site_web VARCHAR(255) DEFAULT NULL,
  top BOOLEAN NOT NULL DEFAULT FALSE,
  id_specialite INT NOT NULL,
  CONSTRAINT chk_artisan_note CHECK (note >= 0 AND note <= 5),
  CONSTRAINT fk_artisan_specialite
    FOREIGN KEY (id_specialite) REFERENCES specialite(id_specialite)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
