# 🚀 Guide de Démarrage Rapide

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:3000/fr` (ou toute autre langue configurée).

## Structure des Langues

Les URLs suivent le format : `/{locale}/page`

Exemples :
- `/fr` - Version française
- `/en` - Version anglaise
- `/es` - Version espagnole
- etc.

## Prochaines Étapes

### 1. Configuration Base de Données (Optionnel)

Pour connecter Supabase :

1. Créez un projet sur [Supabase](https://supabase.com)
2. Créez un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé
```

3. Créez une table `platforms` avec les colonnes nécessaires

### 2. Ajouter des Données de Plateformes

Actuellement, les données sont en dur dans `app/[locale]/trading/page.tsx`. 

Pour utiliser une vraie base de données :
- Créez un fichier `lib/supabase.ts` pour la connexion
- Créez `lib/platforms.ts` pour les requêtes
- Remplacez les données mock par des appels API

### 3. Personnaliser les Traductions

Modifiez les fichiers dans `messages/` pour ajouter ou modifier les traductions.

### 4. Ajouter des Composants

Les composants sont organisés dans :
- `components/ui/` - Composants Shadcn/UI de base
- `components/layout/` - Header, Footer
- `components/comparisons/` - Composants de comparaison
- `components/shared/` - Composants partagés

### 5. Déploiement

Le projet est prêt pour Vercel :

```bash
# Build de test
npm run build

# Si tout fonctionne, déployez sur Vercel
```

## Commandes Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification ESLint
- `npm run i18n:extract` - Extraire les clés de traduction
- `npm run i18n:compile` - Compiler les traductions

## Notes Importantes

- Le middleware `middleware.ts` gère automatiquement la redirection vers la bonne langue
- Les pages doivent être dans `app/[locale]/` pour fonctionner avec i18n
- Utilisez `useTranslations()` dans les composants clients pour les traductions
- Utilisez `getTranslations()` dans les composants serveur








