# 📋 Instructions pour Exécuter le Script SQL

## ⚠️ IMPORTANT : Ne Supprimez RIEN !

**Vous n'avez PAS besoin de supprimer les tables ou données existantes.**

Le script `platforms_add_new_fields.sql` est conçu pour :
- ✅ Ajouter les nouvelles colonnes à la table existante
- ✅ Conserver toutes vos données existantes
- ✅ Être exécuté en toute sécurité plusieurs fois si nécessaire

## 📝 Étapes pour Exécuter le Script

1. **Ouvrez Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Connectez-vous à votre projet

2. **Accédez à l'Éditeur SQL**
   - Dans le menu de gauche, cliquez sur "SQL Editor"
   - Cliquez sur "New query" ou sélectionnez un onglet existant

3. **Copiez le Script**
   - Ouvrez le fichier `platforms_add_new_fields.sql` dans votre éditeur
   - Sélectionnez TOUT le contenu (Ctrl+A)
   - Copiez (Ctrl+C)

4. **Collez dans Supabase**
   - Collez le script dans l'éditeur SQL de Supabase (Ctrl+V)

5. **Exécutez**
   - Cliquez sur le bouton "Run" ou appuyez sur Ctrl+Enter
   - Attendez quelques secondes

6. **Vérifiez**
   - Vous devriez voir un message de succès
   - Les nouvelles colonnes sont maintenant disponibles

## ✅ Résultat Attendu

Après l'exécution, vous devriez voir :
- ✅ Message "Success. No rows returned" (c'est normal)
- ✅ Les nouvelles colonnes ajoutées à la table `platforms`
- ✅ Toutes vos plateformes existantes intactes

## 🔍 Vérifier que ça a Fonctionné

Pour vérifier que les colonnes ont été ajoutées :

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'platforms' 
AND column_name IN (
  'reviews', 
  'country', 
  'country_name', 
  'years_in_operation', 
  'assets', 
  'max_allocations', 
  'promo', 
  'promo_type'
);
```

Vous devriez voir les 8 nouvelles colonnes listées.

## ❌ En Cas d'Erreur

Si vous voyez une erreur comme "column already exists", c'est normal ! Cela signifie que les colonnes existent déjà et le script les ignore grâce à `IF NOT EXISTS`.

## 🎯 Prochaines Étapes

Une fois le script exécuté :
1. Allez sur `/fr/admin`
2. Modifiez ou créez une plateforme
3. Vous verrez maintenant tous les nouveaux champs dans le formulaire
4. Remplissez-les et enregistrez
5. Vérifiez l'affichage sur `/fr/prop-firms`, `/fr/crypto`, etc.

**C'est tout ! Pas de suppression nécessaire. 🎉**

