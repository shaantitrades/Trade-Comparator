'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Save, X, LogOut, Copy, Check, Star } from 'lucide-react'
import { Platform, PlatformRating } from '@/types'
import { AdminLogin } from '@/components/admin/AdminLogin'

export default function AdminPage() {
  const locale = useLocale()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
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
    assets: [],
    description: '',
    website: '',
    reviews: 0,
    country: '',
    countryName: '',
    yearsInOperation: undefined,
    maxAllocations: '',
    promo: '',
    promoType: '',
    bonusCode: '',
    isFeatured: false,
    popularity: 0,
    riskDisclaimer: '',
    availableCountry: 'FR',
    featuredOrder: 0,
  })

  // Vérifier l'authentification au chargement de la page
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
        console.error('Erreur lors de la vérification de l’authentification', error)
        setAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Charger les plateformes depuis Supabase
  const loadPlatforms = async () => {
    try {
      const { getPlatforms } = await import('@/lib/supabase')
      const data = await getPlatforms() // Charger toutes les plateformes sans filtre
      
      // Convertir le format DB vers le format Platform
      const formattedPlatforms: Platform[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        rating: Number(p.rating) || 0,
        ratings: p.ratings || {
          sécurité: 0,
          frais: 0,
          actifs: 0,
          plateforme: 0,
          support: 0,
        },
        advantages: p.advantages || [],
        disadvantages: p.disadvantages || [],
        regulations: p.regulations || [],
        minDeposit: p.min_deposit || 0,
        affiliateUrl: p.affiliate_url || '',
        spread: p.spread,
        leverage: p.leverage,
        platform: p.platform || [],
        assets: p.assets || [],
        description: p.description,
        website: p.website,
        logo: p.logo,
        reviews: p.reviews || 0,
        country: p.country,
        countryName: p.country_name,
        yearsInOperation: p.years_in_operation,
        maxAllocations: p.max_allocations,
        promo: p.promo,
        promoType: p.promo_type,
        bonusCode: p.bonus_code,
        isFeatured: p.is_featured ?? false,
        popularity: p.popularity ?? 0,
        riskDisclaimer: p.risk_disclaimer ?? '',
        availableCountry: p.available_country ?? 'FR',
        featuredOrder: p.featured_order ?? 0,
      }))
      
      setPlatforms(formattedPlatforms)
    } catch (error) {
      console.error('Erreur lors du chargement des plateformes:', error)
      setPlatforms([])
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadPlatforms()
    }
  }, [authenticated])

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(null) // S'assurer qu'on n'est pas en mode édition
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
      spread: '',
      leverage: '',
      platform: [],
      assets: [],
      description: '',
      website: '',
      reviews: 0,
      country: '',
      countryName: '',
      yearsInOperation: undefined,
      maxAllocations: '',
      promo: '',
      promoType: '',
      bonusCode: '',
      isFeatured: false,
      popularity: 0,
      riskDisclaimer: '',
      availableCountry: 'FR',
      featuredOrder: 0,
    })
  }

  const handleEdit = (platform: Platform) => {
    setIsEditing(platform.id)
    setIsAdding(false) // S'assurer qu'on n'est pas en mode ajout
    setFormData(platform)
  }

  const handleSave = async () => {
    try {
      const { createPlatform, updatePlatform } = await import('@/lib/supabase')
      
      // Validation des champs requis
      if (!formData.name || !formData.slug || !formData.affiliateUrl) {
        alert('Veuillez remplir tous les champs obligatoires (Nom, Slug, Lien d\'affiliation).')
        return
      }

      // Vérifier si le slug existe déjà (sauf si on est en mode édition du même slug)
      if (isAdding) {
        const existingPlatform = platforms.find(p => p.slug === formData.slug)
        if (existingPlatform) {
          alert(`Le slug "${formData.slug}" existe déjà. Veuillez choisir un autre slug unique.`)
          return
        }
      } else if (isEditing) {
        // En mode édition, vérifier si le slug a changé et s'il existe déjà
        const currentPlatform = platforms.find(p => p.id === isEditing)
        if (currentPlatform && currentPlatform.slug !== formData.slug) {
          const existingPlatform = platforms.find(p => p.slug === formData.slug && p.id !== isEditing)
          if (existingPlatform) {
            alert(`Le slug "${formData.slug}" existe déjà pour une autre plateforme. Veuillez choisir un autre slug unique.`)
            return
          }
        }
      }
      
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
        assets: formData.assets || [],
        description: formData.description,
        website: formData.website,
        logo: formData.logo,
        reviews: formData.reviews || 0,
        country: formData.country,
        country_name: formData.countryName,
        years_in_operation: formData.yearsInOperation,
        max_allocations: formData.maxAllocations,
        promo: formData.promo,
        promo_type: formData.promoType,
        bonus_code: formData.bonusCode,
        is_featured: formData.isFeatured ?? false,
        popularity: formData.popularity ?? 0,
        risk_disclaimer: formData.riskDisclaimer || null,
        available_country: formData.availableCountry || 'FR',
        featured_order: formData.featuredOrder ?? 0,
      }

      if (isAdding) {
        await createPlatform(dbData)
      } else if (isEditing) {
        await updatePlatform(isEditing, dbData)
      } else {
        alert('Erreur : mode d\'édition non défini.')
        return
      }
      
      // Recharger les plateformes depuis la base de données
      await loadPlatforms()
      
      setIsAdding(false)
      setIsEditing(null)
      setFormData({})
    } catch (error: any) {
      console.error('Error saving platform:', error)
      
      // Gestion d'erreur améliorée avec messages spécifiques
      let errorMessage = 'Erreur lors de la sauvegarde.'
      
      if (error?.code === '23505') {
        // Erreur de contrainte unique (duplicate key)
        if (error?.message?.includes('slug')) {
          errorMessage = `Le slug "${formData.slug}" existe déjà dans la base de données. Veuillez choisir un autre slug unique.`
        } else {
          errorMessage = 'Une contrainte unique est violée. Vérifiez que les données sont uniques (slug, etc.).'
        }
      } else if (error?.code === '23502') {
        errorMessage = 'Des champs obligatoires sont manquants. Vérifiez tous les champs requis.'
      } else if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
        errorMessage = 'Erreur: La connexion à la base de données a expiré. Vérifiez que DATABASE_URL est correctement configuré dans Coolify.'
      } else if (error?.message?.toLowerCase().includes('failed to fetch') || error?.message?.toLowerCase().includes('networkerror')) {
        errorMessage = 'Erreur réseau: Impossible de contacter le serveur. Vérifiez que DATABASE_URL est configuré dans les variables d\'environnement Coolify.'
      } else if (error?.message) {
        errorMessage = `Erreur: ${error.message}`
      } else {
        errorMessage = 'Erreur lors de la sauvegarde. Vérifiez que Supabase est configuré et que les données sont correctes.'
      }
      
      alert(errorMessage)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette plateforme ?')) {
      try {
        const { deletePlatform } = await import('@/lib/supabase')
        await deletePlatform(id)
        // Recharger les plateformes depuis la base de données
        await loadPlatforms()
      } catch (error) {
        console.error('Error deleting platform:', error)
        alert('Erreur lors de la suppression. Vérifiez que Supabase est configuré.')
      }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setIsEditing(null)
    setFormData({})
  }

  const handleCopyBonusCode = async () => {
    if (!formData.bonusCode) {
      alert('Aucun code de bonus à copier.')
      return
    }

    try {
      await navigator.clipboard.writeText(formData.bonusCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
      alert('Impossible de copier le code. Veuillez le copier manuellement.')
    }
  }

  const addArrayItem = (field: 'advantages' | 'disadvantages' | 'regulations' | 'platform' | 'assets') => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), ''],
    })
  }

  const updateArrayItem = (field: 'advantages' | 'disadvantages' | 'regulations' | 'platform' | 'assets', index: number, value: string) => {
    const newArray = [...(formData[field] || [])]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const removeArrayItem = (field: 'advantages' | 'disadvantages' | 'regulations' | 'platform' | 'assets', index: number) => {
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Administration - Plateformes</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Button onClick={handleAdd} className="flex items-center space-x-2 text-sm">
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </Button>
          {platforms.filter(p => p.isFeatured).length > 0 && (
            <Button
              variant={showFeaturedOnly ? 'default' : 'outline'}
              className={`flex items-center space-x-2 text-sm ${showFeaturedOnly ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500' : 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10'}`}
              onClick={() => setShowFeaturedOnly(v => !v)}
            >
              <Star className={`w-4 h-4 ${showFeaturedOnly ? 'fill-black' : 'fill-yellow-400'}`} />
              <span>Vedettes ({platforms.filter(p => p.isFeatured).length})</span>
            </Button>
          )}
          <Link href={`/${locale}/admin/blog`}>
            <Button variant="outline" className="text-sm">
              Blog
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 text-sm">
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
                        value={formData.ratings?.[key] ?? 0}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...(prev || {}),
                            ratings: {
                              ...(prev?.ratings || {
                                sécurité: 0,
                                frais: 0,
                                actifs: 0,
                                plateforme: 0,
                                support: 0,
                              }),
                              [key]: Number(e.target.value),
                            },
                          }))
                        }
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

          {/* Assets (Actifs) */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Actifs (Assets)</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('assets')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.assets || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('assets', index, e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                    placeholder="ex: Crypto, FX, Indices, Metals"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('assets', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Nouveaux champs pour le format tableau */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de reviews</label>
              <input
                type="number"
                min="0"
                value={formData.reviews || 0}
                onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ex: 832"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Code pays (ex: FR, US, AE)</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ex: FR, US, AE"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nom du pays</label>
              <input
                type="text"
                value={formData.countryName || ''}
                onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ex: France, United States"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Années d&apos;opération</label>
              <input
                type="number"
                min="0"
                value={formData.yearsInOperation || ''}
                onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ex: 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Allocation maximale</label>
              <input
                type="text"
                value={formData.maxAllocations || ''}
                onChange={(e) => setFormData({ ...formData, maxAllocations: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ex: $300K, 500K"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Promo (texte)</label>
              <input
                type="text"
                value={formData.promo || ''}
                onChange={(e) => setFormData({ ...formData, promo: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ex: 20% OFF, 120% Reward Fee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Code de bonus</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={formData.bonusCode || ''}
                  onChange={(e) => setFormData({ ...formData, bonusCode: e.target.value })}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                  placeholder="ex: BONUS2024, WELCOME50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBonusCode}
                  disabled={!formData.bonusCode}
                  className="flex items-center space-x-1 whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copié!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type de promo</label>
              <select
                value={formData.promoType || ''}
                onChange={(e) => setFormData({ ...formData, promoType: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Aucun</option>
                <option value="OFF">OFF</option>
                <option value="Reward Fee">Reward Fee</option>
                <option value="MATCH">MATCH</option>
                <option value="Bonus">Bonus</option>
              </select>
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

          {/* Plateforme vedette */}
          <div className="mt-6 border border-yellow-500/30 rounded-lg p-4 bg-yellow-500/5">
            <h3 className="text-sm font-semibold text-yellow-400 mb-4">⭐ Plateforme vedette (Page d&apos;accueil)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                  Afficher en vedette sur la page d&apos;accueil
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ordre d&apos;affichage</label>
                <input
                  type="number"
                  min="0"
                  value={formData.featuredOrder ?? 0}
                  onChange={(e) => setFormData({ ...formData, featuredOrder: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="0 = premier"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Popularité (nb utilisateurs)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.popularity ?? 0}
                  onChange={(e) => setFormData({ ...formData, popularity: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="ex: 547000"
                />
                <p className="text-xs text-muted-foreground mt-1">Affiché comme &quot;547k&quot; ou &quot;1.2M&quot;</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Code pays disponible</label>
                <input
                  type="text"
                  value={formData.availableCountry || 'FR'}
                  onChange={(e) => setFormData({ ...formData, availableCountry: e.target.value.toUpperCase() })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="ex: FR, DE, ES"
                  maxLength={2}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Avertissement risque (disclaimer)</label>
                <input
                  type="text"
                  value={formData.riskDisclaimer || ''}
                  onChange={(e) => setFormData({ ...formData, riskDisclaimer: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="ex: 74% des comptes CFD de détail perdent de l'argent"
                />
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

      {/* Liste des plateformes */}
      <div className="space-y-4">
        {(() => {
          const displayed = showFeaturedOnly
            ? platforms.filter(p => p.isFeatured)
            : platforms

          if (platforms.length === 0) {
            return (
              <div className="glass rounded-lg p-12 text-center">
                <p className="text-muted-foreground">Aucune plateforme pour le moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Cliquez sur &quot;Ajouter une plateforme&quot; pour commencer.</p>
              </div>
            )
          }

          return (
            <>
              {showFeaturedOnly && (
                <div className="flex items-center gap-2 px-1 pb-2 border-b border-yellow-500/20">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">Affichage : plateformes vedettes uniquement</span>
                  <button
                    onClick={() => setShowFeaturedOnly(false)}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Voir toutes
                  </button>
                </div>
              )}
              {displayed.map((platform) => (
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
                    {platform.isFeatured && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md text-xs font-medium">
                        ⭐ Vedette
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Slug: {platform.slug} | Dépôt min: {platform.minDeposit}€
                    {platform.popularity ? ` | Popularité: ${platform.popularity.toLocaleString()}` : ''}
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
          ))}
            </>
          )
        })()}
      </div>
    </div>
  )
}

