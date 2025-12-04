'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Save, X, LogOut, Eye, EyeOff } from 'lucide-react'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { BlogPostDB } from '@/lib/supabase'

export default function BlogAdminPage() {
  const locale = useLocale()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [posts, setPosts] = useState<BlogPostDB[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<BlogPostDB>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    cover_image: '',
    locale: locale,
    published: false,
    tags: [],
    category: 'trading',
  })

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setAuthenticated(data.authenticated === true)
        } else {
          setAuthenticated(false)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification', error)
        setAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Charger les articles de blog
  const loadPosts = async () => {
    try {
      const { getBlogPosts } = await import('@/lib/supabase')
      const data = await getBlogPosts(locale, false) // Charger tous les articles (publiés et non publiés)
      setPosts(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
      setPosts([])
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadPosts()
    }
  }, [authenticated, locale])

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      cover_image: '',
      locale: locale,
      published: false,
      tags: [],
      category: 'trading',
    })
  }

  const handleEdit = (post: BlogPostDB) => {
    setIsEditing(post.id)
    setFormData(post)
    setIsAdding(false)
  }

  const handleSave = async () => {
    try {
      const { createBlogPost, updateBlogPost } = await import('@/lib/supabase')

      if (isAdding) {
        await createBlogPost({
          title: formData.title!,
          slug: formData.slug!,
          excerpt: formData.excerpt || '',
          content: formData.content!,
          author: formData.author || 'Admin',
          cover_image: formData.cover_image || '',
          locale: formData.locale || locale,
          published: formData.published || false,
          tags: formData.tags || [],
          category: formData.category || 'trading',
        })
      } else if (isEditing) {
        await updateBlogPost(isEditing, {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          cover_image: formData.cover_image,
          locale: formData.locale,
          published: formData.published,
          tags: formData.tags,
          category: formData.category,
        })
      }

      await loadPosts()
      setIsAdding(false)
      setIsEditing(null)
      setFormData({})
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Erreur lors de la sauvegarde. Vérifiez que Supabase est configuré et que la table blog_posts existe.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const { deleteBlogPost } = await import('@/lib/supabase')
        await deleteBlogPost(id)
        await loadPosts()
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Erreur lors de la suppression.')
      }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setIsEditing(null)
    setFormData({})
  }

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), ''],
    })
  }

  const updateTag = (index: number, value: string) => {
    const newTags = [...(formData.tags || [])]
    newTags[index] = value
    setFormData({ ...formData, tags: newTags })
  }

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])]
    newTags.splice(index, 1)
    setFormData({ ...formData, tags: newTags })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Afficher le formulaire de connexion si non authentifié
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Vérification de l&apos;authentification...</p>
      </div>
    )
  }

  if (authenticated === false) {
    return <AdminLogin />
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Administration - Blog</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleAdd} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouvel article</span>
          </Button>
          <a href={`/${locale}/admin`}>
            <Button variant="outline">
              Retour aux plateformes
            </Button>
          </a>
        </div>
      </div>

      {/* Formulaire d'ajout/édition */}
      {(isAdding || isEditing) && (
        <div className="glass rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {isAdding ? 'Nouvel article' : 'Modifier l&apos;article'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value),
                  })
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
                placeholder="url-friendly-version"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Extrait</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[80px]"
                placeholder="Court résumé de l'article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contenu *</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[300px] font-mono text-sm"
                placeholder="Contenu de l'article (Markdown supporté)..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Auteur</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image de couverture (URL)</label>
                <input
                  type="url"
                  value={formData.cover_image || ''}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={formData.category || 'trading'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="trading">Trading</option>
                  <option value="crypto">Crypto</option>
                  <option value="education">Éducation</option>
                  <option value="news">Actualités</option>
                  <option value="guides">Guides</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Langue</label>
                <select
                  value={formData.locale || locale}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                  <option value="nl">Nederlands</option>
                  <option value="pl">Polski</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Article publié</span>
              </label>
            </div>

            {/* Tags */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Tags</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.tags || []).map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                      placeholder="tag"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </Button>
          </div>
        </div>
      )}

      {/* Liste des articles */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Aucun article pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Cliquez sur &quot;Nouvel article&quot; pour commencer.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="glass rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-2xl font-bold">{post.title}</h3>
                    {post.published ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-md text-sm flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Publié
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-md text-sm flex items-center">
                        <EyeOff className="w-4 h-4 mr-1" />
                        Brouillon
                      </span>
                    )}
                    <span className="px-3 py-1 bg-primary/20 rounded-md text-sm">
                      {post.category}
                    </span>
                    <span className="px-3 py-1 bg-primary/20 rounded-md text-sm">
                      {post.locale}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Slug: {post.slug} | Auteur: {post.author || 'Admin'}
                  </p>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
                  )}
                  {post.published_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Publié le: {new Date(post.published_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

