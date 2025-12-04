# 🚀 Guide de Déploiement - Trade Comparator

## 📋 Prérequis

Avant de déployer, assurez-vous que :

- ✅ Toutes vos modifications sont poussées sur GitHub
- ✅ Les tables Supabase sont créées (`platforms` et `blog_posts`)
- ✅ Le projet se build correctement en local
- ✅ Vous avez un compte Vercel (gratuit)

---

## ✅ Étape 1 : Tester le Build en Local

Avant de déployer, testez que tout fonctionne :

```bash
# Installer les dépendances (si ce n'est pas déjà fait)
npm install

# Tester le build
npm run build

# Si le build réussit, vous pouvez continuer !
```

**Si vous avez des erreurs de build :**
- Vérifiez la console pour voir les erreurs
- Corrigez-les avant de déployer

---

## 🌐 Étape 2 : Déployer sur Vercel

### Option A : Déploiement via GitHub (Recommandé)

1. **Poussez votre code sur GitHub**
   ```bash
   git add .
   git commit -m "Préparation du déploiement"
   git push origin main
   ```

2. **Connectez votre projet à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub
   - Cliquez sur **"Add New Project"**
   - Sélectionnez votre repository `Trade-Comparator`
   - Cliquez sur **"Import"**

3. **Configurez le projet**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (laisser par défaut)
   - **Build Command** : `npm run build` (déjà configuré)
   - **Output Directory** : `.next` (déjà configuré)

4. **Configurez les Variables d'Environnement**
   
   Avant de déployer, vous **DEVEZ** ajouter ces variables dans Vercel :
   
   Cliquez sur **"Environment Variables"** et ajoutez :

   ```
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-5343389597650456
   ```

   ⚠️ **IMPORTANT** : 
   - Remplacez `votre_url_supabase` par votre vraie URL Supabase
   - Remplacez `votre_clé_anon_supabase` par votre vraie clé Supabase
   - Ces valeurs se trouvent dans votre projet Supabase → Settings → API

5. **Déployez !**
   - Cliquez sur **"Deploy"**
   - Attendez quelques minutes
   - Votre site sera disponible à l'URL fournie par Vercel !

### Option B : Déploiement via Vercel CLI

1. **Installez Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Connectez-vous**
   ```bash
   vercel login
   ```

3. **Déployez**
   ```bash
   vercel
   ```

4. **Suivez les instructions**
   - Sélectionnez votre projet
   - Configurez les variables d'environnement quand demandé

---

## 🔐 Étape 3 : Configurer les Variables d'Environnement dans Vercel

**IMPORTANT** : Les variables d'environnement doivent être configurées dans Vercel pour que le site fonctionne.

### Variables Requises

1. **Allez dans votre projet Vercel**
   - Ouvrez votre projet sur [vercel.com](https://vercel.com)
   - Allez dans **Settings** → **Environment Variables**

2. **Ajoutez ces variables :**

   | Variable | Description | Où la trouver |
   |----------|-------------|---------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | Supabase → Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Supabase → Settings → API → Project API keys → anon public |
   | `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | ID Google AdSense (optionnel) | Déjà configuré : `ca-pub-5343389597650456` |

3. **Sélectionnez les environnements**
   - Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **"Save"**

4. **Redéployez** après avoir ajouté les variables
   - Allez dans **Deployments**
   - Cliquez sur **"..."** sur le dernier déploiement
   - Sélectionnez **"Redeploy"**

---

## 🗄️ Étape 4 : Vérifier la Configuration Supabase

### Permettre les requêtes depuis Vercel

1. **Dans Supabase :**
   - Allez dans **Settings** → **API**
   - Vérifiez que **"Allow requests from all origins"** est activé
   - OU ajoutez votre domaine Vercel dans les CORS autorisés

2. **Vérifiez les tables :**
   - Allez dans **Table Editor**
   - Vérifiez que les tables `platforms` et `blog_posts` existent
   - Vérifiez que RLS est désactivé (pour l'instant)

---

## 🌍 Étape 5 : Configurer un Domaine Personnalisé (Optionnel)

1. **Dans Vercel :**
   - Allez dans **Settings** → **Domains**
   - Ajoutez votre domaine (ex: `tradecomparator.com`)
   - Suivez les instructions pour configurer les DNS

2. **Mise à jour des URLs dans le code :**
   - Le code utilise déjà `https://tradecomparator.com` comme base URL
   - Vérifiez que c'est correct dans `lib/seo.ts`

---

## ✅ Étape 6 : Vérifier que Tout Fonctionne

Après le déploiement, testez :

1. **Page d'accueil**
   - Votre site devrait être accessible
   - Testez toutes les langues

2. **Admin des plateformes**
   - Allez sur `/fr/admin` (ou votre langue)
   - Connectez-vous avec votre mot de passe admin
   - Vérifiez que les plateformes s'affichent

3. **Admin du blog**
   - Allez sur `/fr/admin/blog`
   - Vérifiez que vous pouvez créer des articles

4. **Page blog**
   - Allez sur `/fr/blog`
   - Vérifiez que les articles publiés s'affichent

5. **Les pages de catégories**
   - Testez `/fr/trading`, `/fr/crypto`, etc.
   - Vérifiez que les plateformes s'affichent

---

## 🔄 Mises à Jour Futures

Quand vous faites des modifications :

1. **Poussez sur GitHub**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```

2. **Vercel déploie automatiquement**
   - Si vous avez connecté GitHub, Vercel déploie automatiquement
   - Sinon, exécutez `vercel --prod`

---

## 🐛 Résolution de Problèmes

### Le build échoue sur Vercel

1. **Vérifiez les logs de build dans Vercel**
2. **Vérifiez que toutes les dépendances sont dans `package.json`**
3. **Vérifiez les erreurs TypeScript**

### Les plateformes ne s'affichent pas

1. **Vérifiez les variables d'environnement dans Vercel**
2. **Vérifiez que Supabase est accessible**
3. **Vérifiez les logs dans la console du navigateur**

### Le blog ne fonctionne pas

1. **Vérifiez que la table `blog_posts` existe dans Supabase**
2. **Vérifiez les variables d'environnement**
3. **Vérifiez que RLS est désactivé**

### Erreur 404 sur les pages

1. **Vérifiez que toutes les routes sont correctement configurées**
2. **Vérifiez le middleware pour les langues**
3. **Vérifiez les fichiers de layout**

---

## 📊 Analytics et Monitoring

### Vercel Analytics (Optionnel)

1. **Dans Vercel :**
   - Allez dans **Settings** → **Analytics**
   - Activez Vercel Analytics
   - C'est gratuit pour les projets personnels

### Google Analytics (Optionnel)

Pour ajouter Google Analytics, vous pouvez installer :
```bash
npm install @vercel/analytics
```

---

## 🔒 Sécurité

### Pour la Production

1. **Activez RLS dans Supabase** avec des politiques sécurisées
2. **Changez le mot de passe admin** dans `app/api/admin/auth/route.ts`
3. **Limitez les CORS** dans Supabase aux domaines autorisés
4. **Utilisez des secrets pour les clés sensibles**

---

## 📝 Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] Code poussé sur GitHub
- [ ] Build réussi en local (`npm run build`)
- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Tables Supabase créées
- [ ] Premier déploiement réussi
- [ ] Site accessible
- [ ] Admin fonctionnel
- [ ] Blog fonctionnel
- [ ] Toutes les pages testées

---

**Votre site est maintenant en ligne ! 🎉**

Si vous avez des questions ou des problèmes, consultez les logs dans Vercel ou les messages d'erreur dans la console du navigateur.

