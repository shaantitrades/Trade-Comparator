# 🚀 Guide de Déploiement Rapide

## ✅ Prérequis

- [ ] Code poussé sur GitHub
- [ ] Tables Supabase créées (`platforms` et `blog_posts`)
- [ ] Compte Vercel créé (gratuit)

## 📝 Étapes de Déploiement

### 1. Tester le build localement

```bash
npm run build
```

Si ça fonctionne, continuez !

### 2. Pousser sur GitHub

```bash
git add .
git commit -m "Préparation du déploiement"
git push origin main
```

### 3. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New Project"**
4. Sélectionnez votre repository `Trade-Comparator`
5. Cliquez sur **"Import"**

### 4. ⚠️ IMPORTANT : Variables d'environnement

**AVANT de déployer**, ajoutez ces variables dans Vercel :

Dans **Settings** → **Environment Variables**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-5343389597650456
```

**Où trouver ces valeurs ?**
- Dans Supabase : **Settings** → **API**
  - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key

### 5. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Votre site sera en ligne ! 🎉

## 🔗 URLs après déploiement

- **Site principal** : `https://votre-projet.vercel.app`
- **Admin plateformes** : `https://votre-projet.vercel.app/fr/admin`
- **Admin blog** : `https://votre-projet.vercel.app/fr/admin/blog`
- **Blog public** : `https://votre-projet.vercel.app/fr/blog`

## 🔑 Identifiants Admin

- **Email** : `admin@trades.com`
- **Mot de passe** : `admin0080`

⚠️ **Changez ces identifiants en production !**

## 📋 Checklist Post-Déploiement

- [ ] Site accessible
- [ ] Admin fonctionne
- [ ] Blog fonctionne
- [ ] Plateformes s'affichent
- [ ] Articles s'affichent

## 🆘 Problèmes courants

**Build échoue** : Vérifiez les logs dans Vercel

**Plateformes ne s'affichent pas** : Vérifiez les variables d'environnement

**Blog ne fonctionne pas** : Vérifiez que la table `blog_posts` existe dans Supabase

---

**Voir `DEPLOIEMENT.md` pour le guide complet !**



