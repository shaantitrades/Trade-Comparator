-- ============================================
-- SCRIPT SQL POUR CRÉER LA TABLE BLOG_POSTS
-- ============================================
-- Copiez TOUT ce contenu dans l'éditeur SQL de Supabase
-- Ne copiez PAS les fichiers .md, seulement ce fichier .sql

-- Créer la fonction pour updated_at (si elle n'existe pas déjà)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer la table blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Admin',
  cover_image TEXT,
  locale TEXT DEFAULT 'fr' CHECK (locale IN ('fr', 'en', 'es', 'de', 'it', 'pt', 'nl', 'pl')),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'trading'
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale);

-- Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- DÉSACTIVER RLS pour commencer (vous pourrez l'activer plus tard)
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

