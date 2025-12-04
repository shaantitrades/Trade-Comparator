-- ============================================
-- SCRIPT SQL CORRIGÉ POUR LA TABLE PLATFORMS
-- ============================================
-- Ce script peut être exécuté même si la table existe déjà
-- Il évite toutes les erreurs de duplication

-- Étape 1 : Créer la fonction pour updated_at (si elle n'existe pas déjà)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Étape 2 : Créer la table platforms (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS platforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('trading', 'crypto', 'prop-firms', 'binary-options', 'signals', 'education')),
  rating DECIMAL(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  ratings JSONB NOT NULL DEFAULT '{
    "sécurité": 0,
    "frais": 0,
    "actifs": 0,
    "plateforme": 0,
    "support": 0
  }',
  advantages TEXT[] DEFAULT '{}',
  disadvantages TEXT[] DEFAULT '{}',
  regulations TEXT[] DEFAULT '{}',
  min_deposit INTEGER DEFAULT 0,
  affiliate_url TEXT NOT NULL,
  spread TEXT,
  leverage TEXT,
  platform TEXT[] DEFAULT '{}',
  description TEXT,
  website TEXT,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Étape 3 : Créer les index (si ils n'existent pas déjà)
CREATE INDEX IF NOT EXISTS idx_platforms_category ON platforms(category);
CREATE INDEX IF NOT EXISTS idx_platforms_slug ON platforms(slug);

-- Étape 4 : Supprimer l'ancien trigger s'il existe, puis créer le nouveau
DROP TRIGGER IF EXISTS update_platforms_updated_at ON platforms;
CREATE TRIGGER update_platforms_updated_at 
BEFORE UPDATE ON platforms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Étape 5 : Supprimer toutes les anciennes politiques RLS si elles existent
DROP POLICY IF EXISTS "Platforms are viewable by everyone" ON platforms;
DROP POLICY IF EXISTS "Platforms are insertable by everyone" ON platforms;
DROP POLICY IF EXISTS "Platforms are updatable by everyone" ON platforms;
DROP POLICY IF EXISTS "Platforms are deletable by everyone" ON platforms;

-- Étape 6 : DÉSACTIVER RLS pour éviter les problèmes de permissions
-- Vous pourrez l'activer plus tard avec des politiques sécurisées si nécessaire
ALTER TABLE platforms DISABLE ROW LEVEL SECURITY;

