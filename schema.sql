-- ============================================================
-- SCHEMA COMPLET - À exécuter dans Coolify PostgreSQL
-- ============================================================

-- Fonction trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ─── Table platforms ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platforms (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  category         TEXT NOT NULL CHECK (category IN ('trading', 'crypto', 'prop-firms', 'binary-options', 'signals', 'education')),
  rating           DECIMAL(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  ratings          JSONB NOT NULL DEFAULT '{"sécurité":0,"frais":0,"actifs":0,"plateforme":0,"support":0}',
  advantages       TEXT[] DEFAULT '{}',
  disadvantages    TEXT[] DEFAULT '{}',
  regulations      TEXT[] DEFAULT '{}',
  min_deposit      INTEGER DEFAULT 0,
  affiliate_url    TEXT NOT NULL,
  spread           TEXT,
  leverage         TEXT,
  platform         TEXT[] DEFAULT '{}',
  description      TEXT,
  website          TEXT,
  logo             TEXT,
  reviews          INTEGER DEFAULT 0,
  country          TEXT,
  country_name     TEXT,
  years_in_operation INTEGER,
  assets           TEXT[] DEFAULT '{}',
  max_allocations  TEXT,
  promo            TEXT,
  promo_type       TEXT,
  bonus_code       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platforms_category ON platforms(category);
CREATE INDEX IF NOT EXISTS idx_platforms_slug ON platforms(slug);
CREATE INDEX IF NOT EXISTS idx_platforms_country ON platforms(country);

DROP TRIGGER IF EXISTS update_platforms_updated_at ON platforms;
CREATE TRIGGER update_platforms_updated_at
  BEFORE UPDATE ON platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Table blog_posts ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT NOT NULL,
  author       TEXT DEFAULT 'Admin',
  cover_image  TEXT,
  locale       TEXT DEFAULT 'fr' CHECK (locale IN ('fr','en','es','de','it','pt','nl','pl')),
  published    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags         TEXT[] DEFAULT '{}',
  category     TEXT DEFAULT 'trading',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug      ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale    ON blog_posts(locale);

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
