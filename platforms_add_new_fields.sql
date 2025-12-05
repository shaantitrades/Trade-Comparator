-- ============================================
-- SCRIPT SQL POUR AJOUTER LES NOUVEAUX CHAMPS
-- ============================================
-- Ce script ajoute les nouveaux champs nécessaires pour le format tableau

-- Ajouter la colonne reviews (nombre de reviews)
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;

-- Ajouter la colonne country (code pays, ex: "AE", "US", "FR")
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Ajouter la colonne country_name (nom complet du pays)
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS country_name TEXT;

-- Ajouter la colonne years_in_operation (années d'opération)
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS years_in_operation INTEGER;

-- Ajouter la colonne assets (types d'actifs: Crypto, FX, Indices, etc.)
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS assets TEXT[] DEFAULT '{}';

-- Ajouter la colonne max_allocations (allocation maximale, ex: "$300K", "500K")
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS max_allocations TEXT;

-- Ajouter la colonne promo (texte de l'offre promotionnelle, ex: "20% OFF")
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS promo TEXT;

-- Ajouter la colonne promo_type (type de promo, ex: "OFF", "Reward Fee")
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS promo_type TEXT;

-- Ajouter la colonne bonus_code (code de bonus à copier)
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS bonus_code TEXT;

-- Créer un index sur country pour les filtres
CREATE INDEX IF NOT EXISTS idx_platforms_country ON platforms(country);

-- Créer un index sur years_in_operation pour le tri
CREATE INDEX IF NOT EXISTS idx_platforms_years ON platforms(years_in_operation);


