# 🗄️ Configuration Supabase pour Trade Comparator

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez votre URL et votre clé anonyme

## Étape 2 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme
```

## Étape 3 : Créer la table `platforms`

Dans l'éditeur SQL de Supabase, exécutez cette requête :

```sql
-- Créer la table platforms
CREATE TABLE platforms (
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

-- Créer un index sur la catégorie pour les requêtes rapides
CREATE INDEX idx_platforms_category ON platforms(category);

-- Créer un index sur le slug pour les recherches
CREATE INDEX idx_platforms_slug ON platforms(slug);

-- Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON platforms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire les plateformes
CREATE POLICY "Platforms are viewable by everyone" ON platforms
  FOR SELECT USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent insérer/modifier/supprimer
-- (Vous devrez configurer l'authentification Supabase pour cela)
CREATE POLICY "Platforms are insertable by authenticated users" ON platforms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Platforms are updatable by authenticated users" ON platforms
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Platforms are deletable by authenticated users" ON platforms
  FOR DELETE USING (auth.role() = 'authenticated');
```

## Étape 4 : Configuration de l'authentification (Optionnel mais recommandé)

Pour sécuriser la page admin, vous pouvez :

1. **Option Simple** : Créer une route API protégée avec un token secret
2. **Option Complète** : Utiliser Supabase Auth avec email/password

### Option Simple - Route API protégée

Créez `app/api/admin/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-in-production'

export async function POST(request: NextRequest) {
  const { secret } = await request.json()
  
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Créer une session ou retourner un token
  return NextResponse.json({ success: true })
}
```

Puis dans `.env.local` :
```env
ADMIN_SECRET=votre_secret_super_securise
```

## Étape 5 : Utiliser la page Admin

1. Accédez à `/fr/admin` (ou `/en/admin`, etc.)
2. Ajoutez vos plateformes avec tous les détails
3. Les liens d'affiliation seront automatiquement utilisés dans les boutons CTA

## Structure des données

Chaque plateforme contient :
- **Informations de base** : nom, slug, catégorie
- **Évaluations** : note globale + 5 critères détaillés
- **Avantages/Inconvénients** : listes de points
- **Régulations** : badges (FCA, CySEC, etc.)
- **Informations techniques** : dépôt min, spread, leverage
- **Lien d'affiliation** : URL pour les partenariats
- **Métadonnées** : description, site web, logo

## Alternative : Sanity.io

Si vous préférez utiliser Sanity.io (déjà mentionné dans le projet), vous pouvez :
1. Créer un projet sur [sanity.io](https://sanity.io)
2. Configurer le schéma pour les plateformes
3. Utiliser le Studio Sanity pour gérer le contenu
4. Intégrer via l'API Sanity

**Avantages de Sanity** :
- Interface CMS très intuitive
- Gestion de contenu en temps réel
- Pas besoin de base de données SQL
- Excellent pour le contenu éditorial

**Avantages de Supabase** :
- Plus de contrôle sur les données
- SQL natif pour requêtes complexes
- Gratuit jusqu'à 500MB
- Intégration facile avec Next.js






