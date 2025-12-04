# 📝 Configuration du Système de Blog

## ⚠️ IMPORTANT : Instructions d'Installation

**Ne copiez PAS ce fichier Markdown dans l'éditeur SQL !**

### Étape 1 : Créer la table `blog_posts` dans Supabase

1. **Ouvrez votre projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Connectez-vous et sélectionnez votre projet

2. **Accédez à l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New query"** pour créer une nouvelle requête

3. **Copiez UNIQUEMENT le contenu SQL**
   - Ouvrez le fichier `blog_posts_table.sql` dans votre projet
   - **Copiez TOUT le contenu** de ce fichier (c'est du SQL pur, sans commentaires Markdown)
   - Collez-le dans l'éditeur SQL de Supabase

4. **Exécutez la requête**
   - Cliquez sur **"Run"** ou appuyez sur `Ctrl+Enter` (Windows) ou `Cmd+Enter` (Mac)
   - Vous devriez voir "Success. No rows returned"

### 📄 Fichiers SQL disponibles

**Pour une installation simple (recommandé) :**
- Utilisez le fichier **`blog_setup_simple.sql`** 
- Ce fichier désactive RLS par défaut pour éviter les problèmes de permissions

**Pour une installation avancée :**
- Utilisez le fichier **`blog_posts_table.sql`**
- Ce fichier active RLS (Row Level Security) - nécessite une configuration supplémentaire

### 🎯 Instructions détaillées

1. **Ouvrez le fichier SQL :**
   - Ouvrez **`blog_setup_simple.sql`** dans votre éditeur de code
   - **Sélectionnez TOUT le contenu** (Ctrl+A ou Cmd+A)
   - **Copiez** (Ctrl+C ou Cmd+C)

2. **Dans Supabase :**
   - Allez sur [supabase.com](https://supabase.com)
   - Sélectionnez votre projet
   - Cliquez sur **"SQL Editor"** dans le menu de gauche
   - Cliquez sur **"New query"** 
   - **Collez** le contenu SQL (Ctrl+V ou Cmd+V)
   - Cliquez sur **"Run"** ou appuyez sur `Ctrl+Enter`

3. **Vérifiez que ça fonctionne :**
   - Allez dans **"Table Editor"** 
   - Vous devriez voir la table **`blog_posts`**

### ⚠️ Erreur courante

**Si vous obtenez une erreur de syntaxe :**
- ❌ **NE copiez PAS** le fichier `BLOG_SETUP.md` (c'est un fichier Markdown)
- ✅ **Copiez UNIQUEMENT** le fichier `.sql` (`blog_setup_simple.sql` ou `blog_posts_table.sql`)

### Alternative : Désactiver RLS temporairement

Si vous obtenez des erreurs de permissions, vous pouvez temporairement désactiver RLS :

```sql
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
```

⚠️ **Important** : Activez RLS à nouveau une fois que vous avez configuré l'authentification appropriée pour la sécurité.

---

## Étape 2 : Vérifier que la table a été créée

1. Dans Supabase, allez dans **"Table Editor"** (menu de gauche)
2. Vous devriez voir la table **`blog_posts`** dans la liste
3. Si la table est présente, vous pouvez continuer !

---

## Étape 3 : Accéder à l'interface d'administration

L'interface d'administration du blog sera disponible à :
- **URL** : `https://votre-site.com/fr/admin/blog` (ou `/en/admin/blog`, etc.)
- **Authentification** : Utilisez les mêmes identifiants que pour la gestion des plateformes

## Structure des Articles

Chaque article de blog contient :
- **Titre** : Le titre de l'article
- **Slug** : URL-friendly version du titre (ex: "meilleur-broker-forex")
- **Extrait** : Court résumé affiché dans la liste
- **Contenu** : Le contenu complet de l'article (Markdown supporté)
- **Auteur** : Nom de l'auteur
- **Image de couverture** : URL de l'image principale
- **Langue** : Locale de l'article (fr, en, es, etc.)
- **Publié** : Statut de publication
- **Date de publication** : Quand l'article a été publié
- **Tags** : Mots-clés pour la catégorisation
- **Catégorie** : trading, crypto, education, etc.

## Prochaines Étapes

Après avoir créé la table, l'interface d'administration sera automatiquement disponible dans votre page admin.

