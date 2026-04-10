-- SQL pour ajouter les champs des plateformes vedettes (featured)
-- À exécuter dans votre base de données PostgreSQL

-- Ajouter les colonnes nécessaires à la table platforms
ALTER TABLE platforms
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS popularity INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_disclaimer TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS available_country VARCHAR(10) DEFAULT 'FR',
  ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Index pour les plateformes vedettes
CREATE INDEX IF NOT EXISTS idx_platforms_featured ON platforms (is_featured, featured_order);

-- Exemples de mise à jour pour test (adapter les slugs réels)
-- UPDATE platforms SET is_featured = true, popularity = 547000, risk_disclaimer = '74% des comptes CFD de détail perdent de l''argent', featured_order = 1 WHERE slug = 'interactive-brokers' AND category = 'trading';
-- UPDATE platforms SET is_featured = true, popularity = 70000, risk_disclaimer = '61% des comptes CFD de détail perdent de l''argent', featured_order = 2 WHERE slug = 'saxo' AND category = 'trading';
