-- Créer la table blog_posts
CREATE TABLE blog_posts (
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

-- Créer un index sur le slug pour les recherches
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Créer un index sur published pour les requêtes rapides
CREATE INDEX idx_blog_posts_published ON blog_posts(published);

-- Créer un index sur locale pour le filtrage par langue
CREATE INDEX idx_blog_posts_locale ON blog_posts(locale);

-- Créer un trigger pour mettre à jour updated_at automatiquement
-- (Cette fonction devrait déjà exister si vous avez créé la table platforms)
-- Si vous obtenez une erreur, créez d'abord la fonction :
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS) - Optionnel mais recommandé
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des articles publiés à tous
CREATE POLICY "Public posts are viewable by everyone"
ON blog_posts FOR SELECT
USING (published = true);

-- Politique pour permettre l'écriture aux admins seulement
-- Pour l'instant, désactivez RLS temporairement si vous êtes le seul admin
-- ou configurez l'authentification Supabase appropriée
-- Vous pouvez désactiver RLS avec: ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

