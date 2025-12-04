# 🔐 Guide d'Accès - Administration et Blog

## ✅ Problèmes Résolus

### 1. **Problème des plateformes non visibles dans l'admin**

✅ **Résolu !** Les plateformes que vous ajoutez via l'admin s'affichent maintenant correctement dans la liste et peuvent être modifiées ou supprimées.

**Ce qui a été corrigé :**
- Le chargement des plateformes depuis Supabase est maintenant actif
- Les plateformes se rechargent automatiquement après chaque ajout/modification/suppression
- Toutes les plateformes (toutes catégories) sont affichées dans l'admin

---

## 📍 Comment Accéder aux Interfaces d'Administration

### **1. Administration des Plateformes**

**URL :** `https://votre-site.com/fr/admin` (ou `/en/admin`, `/es/admin`, etc.)

**Fonctionnalités :**
- ✅ Voir toutes les plateformes ajoutées
- ✅ Ajouter une nouvelle plateforme
- ✅ Modifier une plateforme existante
- ✅ Supprimer une plateforme
- ✅ Toutes les catégories sont visibles (trading, crypto, prop-firms, etc.)

**Authentification :** Utilisez le même mot de passe admin configuré dans votre fichier d'environnement.

---

### **2. Administration du Blog** 🆕

**URL :** `https://votre-site.com/fr/admin/blog` (ou `/en/admin/blog`, etc.)

**Fonctionnalités :**
- ✅ Créer un nouvel article de blog
- ✅ Modifier un article existant
- ✅ Supprimer un article
- ✅ Publier/Dépublier des articles (brouillon/publié)
- ✅ Gérer les articles par langue
- ✅ Ajouter des tags et catégories

**Comment accéder :**
1. Allez sur `/fr/admin` (ou votre langue)
2. Cliquez sur le bouton **"Gérer le blog"** en haut à droite
3. Ou allez directement sur `/fr/admin/blog`

---

## 📝 Comment Publier un Article de Blog

### **Étape 1 : Créer la table dans Supabase**

Avant de pouvoir utiliser le blog, vous devez créer la table `blog_posts` dans Supabase.

**Voir le fichier `BLOG_SETUP.md`** pour les instructions SQL complètes.

**Résumé rapide :**
1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Exécutez la requête SQL fournie dans `BLOG_SETUP.md`
4. La table `blog_posts` sera créée avec tous les champs nécessaires

### **Étape 2 : Créer un article**

1. **Accédez à l'admin blog :** `/fr/admin/blog`
2. **Cliquez sur "Nouvel article"**
3. **Remplissez le formulaire :**
   - **Titre** : Le titre de l'article (ex: "Meilleur Broker Forex 2024")
   - **Slug** : Généré automatiquement à partir du titre (peut être modifié manuellement)
   - **Extrait** : Court résumé (optionnel mais recommandé)
   - **Contenu** : Le contenu complet de l'article (Markdown supporté)
   - **Auteur** : Votre nom (par défaut: "Admin")
   - **Image de couverture** : URL de l'image principale (optionnel)
   - **Catégorie** : trading, crypto, education, news, guides
   - **Langue** : Sélectionnez la langue de l'article
   - **Publié** : Cochez pour publier immédiatement, ou laissez décoché pour un brouillon
   - **Tags** : Ajoutez des mots-clés pour la catégorisation

4. **Cliquez sur "Enregistrer"**

### **Étape 3 : Publier l'article**

- **Si vous avez coché "Publié"** : L'article est immédiatement visible sur le site
- **Si vous avez laissé décoché** : L'article est en brouillon et visible uniquement dans l'admin

Pour publier un brouillon :
1. Cliquez sur "Modifier" sur l'article en brouillon
2. Cochez "Article publié"
3. Cliquez sur "Enregistrer"

---

## 🌐 Où Voir les Articles Publiés

### **Page Blog Publique**

**URL :** `https://votre-site.com/fr/blog` (ou `/en/blog`, etc.)

Cette page affiche tous les articles publiés dans la langue sélectionnée.

**Fonctionnalités :**
- Affichage en grille des articles avec images de couverture
- Filtrage automatique par langue
- Affichage des catégories et tags
- Liens vers les articles individuels

### **Page Article Individuelle**

**URL :** `https://votre-site.com/fr/blog/slug-de-l-article`

Chaque article a sa propre page avec le contenu complet.

---

## 🔑 Authentification Admin

L'authentification utilise les mêmes identifiants pour :
- Administration des plateformes (`/admin`)
- Administration du blog (`/admin/blog`)

**Configuration :**
- Vérifiez votre fichier `.env.local` pour les variables d'environnement
- Le mot de passe admin est configuré dans votre route API (`app/api/admin/auth/route.ts`)

---

## 📋 Checklist de Démarrage

- [ ] **Supabase configuré** : Table `platforms` créée ✅
- [ ] **Table blog créée** : Exécuter le SQL dans `BLOG_SETUP.md` (voir ci-dessous)
- [ ] **Variables d'environnement** : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurées
- [ ] **Test admin plateformes** : Accéder à `/fr/admin` et vérifier que les plateformes s'affichent
- [ ] **Test admin blog** : Accéder à `/fr/admin/blog` et créer un premier article
- [ ] **Test page blog** : Vérifier que les articles publiés apparaissent sur `/fr/blog`

---

## 🆘 Dépannage

### Les plateformes ne s'affichent pas dans l'admin

1. Vérifiez que Supabase est configuré (variables d'environnement)
2. Vérifiez que la table `platforms` existe dans Supabase
3. Vérifiez la console du navigateur pour les erreurs
4. Vérifiez que vous êtes bien connecté (authentifié)

### Le blog ne fonctionne pas

1. **Vérifiez que la table `blog_posts` existe :**
   - Allez dans Supabase → Table Editor
   - Vous devriez voir la table `blog_posts`
   - Si elle n'existe pas, exécutez le SQL dans `BLOG_SETUP.md`

2. **Vérifiez les erreurs dans la console du navigateur**

3. **Vérifiez que vous êtes authentifié**

### Les articles ne s'affichent pas sur la page blog

1. Vérifiez que l'article est **publié** (case "Article publié" cochée)
2. Vérifiez que la **langue** de l'article correspond à la langue de la page
3. Vérifiez que l'article est bien enregistré dans Supabase

---

## 📚 Fichiers de Documentation

- **`BLOG_SETUP.md`** : Instructions pour créer la table blog dans Supabase
- **`SUPABASE_SETUP.md`** : Configuration générale de Supabase
- **`ADMIN_INTEGRATION_GUIDE.md`** : Guide d'intégration de l'admin

---

## 💡 Astuces

1. **Générateur de slug automatique** : Le slug est généré automatiquement à partir du titre, mais vous pouvez le modifier manuellement
2. **Articles multilingues** : Créez une version de chaque article pour chaque langue
3. **Brouillons** : Utilisez la fonctionnalité "Brouillon" pour préparer vos articles avant publication
4. **Tags** : Utilisez des tags pertinents pour améliorer la navigation et le SEO
5. **Images de couverture** : Ajoutez toujours une image de couverture pour rendre vos articles plus attractifs

---

**Bon blogging ! 🚀**

