'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Save, X, LogOut } from 'lucide-react'
import { Platform, PlatformRating } from '@/types'
import { AdminLogin } from '@/components/admin/AdminLogin'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Platform>>({
    name: '',
    slug: '',
    category: 'trading',
    rating: 0,
    ratings: {
      sécurité: 0,
      frais: 0,
      actifs: 0,
      plateforme: 0,
      support: 0,
    },
    advantages: [],
    disadvantages: [],
    regulations: [],
    minDeposit: 0,
    affiliateUrl: '',
    spread: '',
    leverage: '',
    platform: [],
    description: '',
    website: '',
  })

  // Charger les plateformes (à remplacer par un appel API réel)
  useEffect(() => {
    // TODO: Charger depuis Supabase
    // const loadPlatforms = async () => {
    //   const { data } = await supabase.from('platforms').select('*')
    //   setPlatforms(data || [])
    // }
    // loadPlatforms()
  }, [])

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      name: '',
      slug: '',
      category: 'trading',
      rating: 0,
      ratings: {
        sécurité: 0,
        frais: 0,
        actifs: 0,
        plateforme: 0,
        support: 0,
      },
      advantages: [],
      disadvantages: [],
      regulations: [],
      minDeposit: 0,
      affiliateUrl: '',
    })
  }

  const handleEdit = (platform: Platform) => {
    setIsEditing(platform.id)
    setFormData(platform)
    setIsAdding(false)
  }

  const handleSave = async () => {
    try {
      const { createPlatform, updatePlatform } = await import('@/lib/supabase')
      
      // Convertir le format Platform vers le format DB
      const dbData = {
        name: formData.name!,
        slug: formData.slug!,
        category: formData.category!,
        rating: formData.rating || 0,
        ratings: formData.ratings || {
          sécurité: 0,
          frais: 0,
          actifs: 0,
          plateforme: 0,
          support: 0,
        },
        advantages: formData.advantages || [],
        disadvantages: formData.disadvantages || [],
        regulations: formData.regulations || [],
        min_deposit: formData.minDeposit || 0,
        affiliate_url: formData.affiliateUrl!,
        spread: formData.spread,
        leverage: formData.leverage,
        platform: formData.platform || [],
        description: formData.description,
        website: formData.website,
        logo: formData.logo,
      }

      if (isAdding) {
        const newPlatform = await createPlatform(dbData)
        setPlatforms([...platforms, {
          ...newPlatform,
          minDeposit: newPlatform.min_deposit,
          affiliateUrl: newPlatform.affiliate_url,
        } as Platform])
      } else if (isEditing) {
        await updatePlatform(isEditing, dbData)
        setPlatforms(platforms.map(p => p.id === isEditing ? { ...p, ...formData } : p))
      }
      
      setIsAdding(false)
      setIsEditing(null)
      setFormData({})
    } catch (error) {
      console.error('Error saving platform:', error)
      alert('Erreur lors de la sauvegarde. Vérifiez que Supabase est configuré.')
      // Fallback : sauvegarde locale si Supabase n'est pas configuré
      if (isAdding) {
        const newPlatform: Platform = {
          ...(formData as Platform),
          id: Date.now().toString(),
        }
        setPlatforms([...platforms, newPlatform])
        setIsAdding(false)
        setIsEditing(null)
        setFormData({})
      } else if (isEditing) {
        setPlatforms(platforms.map(p => p.id === isEditing ? { ...p, ...formData } : p))
        setIsAdding(false)
        setIsEditing(null)
        setFormData({})
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette plateforme ?')) {
      try {
        const { deletePlatform } = await import('@/lib/supabase')
        await deletePlatform(id)
        setPlatforms(platforms.filter(p => p.id !== id))
      } catch (error) {
        console.error('Error deleting platform:', error)
        // Fallback : suppression locale si Supabase n'est pas configuré
        setPlatforms(platforms.filter(p => p.id !== id))
      }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setIsEditing(null)
    setFormData({})
  }

  const addArrayItem = (field: 'advantages' | 'disadvantages' | 'regulations' | 'platform') => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), ''],
    })
  }

  const updateArrayItem = (field: 'advantages' | 'disadvantages' | 'regulations' | 'platform', index: number, value: string) => {
    const newArray = [...(formData[field] || [])]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const removeArrayItem = (field: 'advantages' | 'disadvantages' | 'regulations' | 'platform', index: number) => {
    const newArray = [...(formData[field] || [])]
    newArray.splice(index, 1)
    setFormData({ ...formData, [field]: newArray })
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      setAuthenticated(false)
      window.location.reload()
    } catch (error) {
      console.error('Error logging out:', error)
    }
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
        <h1 className="text-4xl font-bold">Administration - Plateformes</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleAdd} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Ajouter une plateforme</span>
          </Button>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>

      {/* Formulaire d'ajout/édition */}
      {(isAdding || isEditing) && (
        <div className="glass rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {isAdding ? 'Nouvelle plateforme' : 'Modifier la plateforme'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <select
                  value={formData.category || 'trading'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="trading">Trading</option>
                  <option value="crypto">Crypto</option>
                  <option value="prop-firms">Prop Firms</option>
                  <option value="binary-options">Options Binaires</option>
                  <option value="signals">Signaux</option>
                  <option value="education">Éducation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Site web</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lien d&apos;affiliation *</label>
                <input
                  type="url"
                  value={formData.affiliateUrl || ''}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dépôt minimum (€)</label>
                <input
                  type="number"
                  value={formData.minDeposit || 0}
                  onChange={(e) => setFormData({ ...formData, minDeposit: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>

            {/* Notes et évaluations */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Note globale (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating || 0}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes détaillées (0-5)</label>
                <div className="space-y-2">
                  {(['sécurité', 'frais', 'actifs', 'plateforme', 'support'] as const).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <label className="w-24 text-sm capitalize">{key}</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.ratings?.[key] || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          ratings: { ...formData.ratings, [key]: Number(e.target.value) }
                        })}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Spread</label>
                <input
                  type="text"
                  value={formData.spread || ''}
                  onChange={(e) => setFormData({ ...formData, spread: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="ex: 1.0 pips"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Effet de levier</label>
                <input
                  type="text"
                  value={formData.leverage || ''}
                  onChange={(e) => setFormData({ ...formData, leverage: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="ex: 1:30"
                />
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Avantages</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('advantages')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.advantages || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('advantages', index, e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('advantages', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Inconvénients */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Inconvénients</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('disadvantages')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.disadvantages || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('disadvantages', index, e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('disadvantages', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Régulations */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Régulations</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('regulations')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.regulations || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('regulations', index, e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                    placeholder="ex: FCA, CySEC"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('regulations', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Plateformes */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Plateformes supportées</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('platform')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.platform || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('platform', index, e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                    placeholder="ex: MT4, MT5, Web"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('platform', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
              placeholder="Description de la plateforme..."
            />
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

      {/* Liste des plateformes */}
      <div className="space-y-4">
        {platforms.length === 0 ? (
          <div className="glass rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Aucune plateforme pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Cliquez sur &quot;Ajouter une plateforme&quot; pour commencer.</p>
          </div>
        ) : (
          platforms.map((platform) => (
            <div key={platform.id} className="glass rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-2xl font-bold">{platform.name}</h3>
                    <span className="px-3 py-1 bg-primary/20 rounded-md text-sm">
                      {platform.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Note: {platform.rating}/5
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Slug: {platform.slug} | Dépôt min: {platform.minDeposit}€
                  </p>
                  {platform.affiliateUrl && (
                    <a
                      href={platform.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-1 block"
                    >
                      Lien d&apos;affiliation
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(platform)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(platform.id)}
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

