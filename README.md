# 🚀 Trade Comparator - Comparateur de Plateformes de Trading

Site web moderne de comparaison des plateformes de trading avec support multilingue (8 langues), design premium et fonctionnalités avancées.

## ✨ Fonctionnalités

- 🌍 **8 Langues** : Français, Anglais, Espagnol, Allemand, Italien, Portugais, Néerlandais, Polonais
- 🎨 **Design Moderne** : Glassmorphism, animations fluides avec Framer Motion
- 📊 **Comparaisons Avancées** : Tableaux interactifs, filtres intelligents, cartes de plateformes
- 🔍 **Filtres Intelligents** : Par régulateur, actifs, pays, dépôt minimum
- ⭐ **Système de Notation** : 5 critères (sécurité, frais, actifs, plateforme, support)
- 📱 **Responsive** : Mobile-first design
- ⚡ **Performance** : Optimisé avec Next.js 14 App Router

## 🛠️ Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Styling** : Tailwind CSS + Framer Motion
- **UI Components** : Shadcn/UI + Radix UI
- **Internationalisation** : next-intl
- **Icons** : Lucide React
- **TypeScript** : Support complet

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Démarrer en production
npm start
```

## 🌐 Configuration des Langues

Les fichiers de traduction se trouvent dans `messages/` :
- `fr.json` - Français
- `en.json` - Anglais
- `es.json` - Espagnol
- `de.json` - Allemand
- `it.json` - Italien
- `pt.json` - Portugais
- `nl.json` - Néerlandais
- `pl.json` - Polonais

## 📁 Structure du Projet

```
app/
├── [locale]/          # Pages avec support i18n
│   ├── layout.tsx
│   ├── page.tsx       # Accueil
│   ├── trading/       # Page Trading
│   ├── crypto/        # Page Crypto
│   ├── prop-firms/    # Page Prop Firms
│   ├── binary-options/# Page Options Binaires
│   └── blog/          # Page Blog
├── globals.css        # Styles globaux
└── layout.tsx         # Layout racine

components/
├── ui/                # Composants Shadcn/UI
├── layout/            # Header, Footer
├── comparisons/       # Composants de comparaison
└── shared/            # Composants partagés

messages/              # Fichiers de traduction
lib/                   # Utilitaires
```

## 🎨 Composants Principaux

- **Header** : Navigation sticky avec sélecteur de langue
- **Hero Section** : Section d'accueil avec animations
- **ComparisonTable** : Tableaux comparatifs interactifs
- **PlatformCard** : Cartes de plateformes avec détails
- **FilterSidebar** : Filtres avancés avec accordéon
- **AnimatedCounter** : Compteurs animés pour statistiques
- **GradientBackground** : Background avec effets de particules

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` :

```env
# Supabase (optionnel)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Sanity.io (optionnel pour le blog)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## 🚀 Déploiement

Le projet est prêt pour le déploiement sur Vercel :

1. Connectez votre repository GitHub
2. Vercel détectera automatiquement Next.js
3. Les variables d'environnement peuvent être configurées dans le dashboard Vercel

## 📝 TODO

- [ ] Intégration Supabase pour les données des plateformes
- [ ] Intégration Sanity.io pour le blog
- [ ] Système d'authentification utilisateur
- [ ] Export PDF des comparaisons
- [ ] Mode sombre/clair
- [ ] Analytics (Vercel Analytics + GA4)
- [ ] SEO avancé avec Schema.org

## 📄 Licence

MIT

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.








