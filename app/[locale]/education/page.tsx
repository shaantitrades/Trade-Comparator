'use client'

import { useTranslations } from 'next-intl'
import { ComparisonTable } from '@/components/comparisons/ComparisonTable'
import { PlatformCard } from '@/components/comparisons/PlatformCard'
import { FilterSidebar } from '@/components/comparisons/FilterSidebar'
import { useState, useEffect } from 'react'
import { getPlatforms } from '@/lib/supabase'
import { Platform } from '@/types'

export default function EducationPage() {
  const t = useTranslations('common')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await getPlatforms('education')
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
          description: p.description,
          website: p.website,
          logo: p.logo,
        }))
        setPlatforms(formattedPlatforms)
      } catch (error) {
        console.error('Error loading platforms:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPlatforms()
  }, [])

  const filterOptions = [
    {
      id: 'level',
      label: 'Niveau',
      type: 'checkbox' as const,
      options: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'],
    },
    {
      id: 'format',
      label: 'Format',
      type: 'checkbox' as const,
      options: ['Vidéo', 'Texte', 'Interactif', 'Webinaire'],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Formations & Éducation au Trading</h1>
        <p className="text-muted-foreground">
          Comparez les meilleures plateformes pédagogiques pour apprendre le trading, du débutant au trader expérimenté
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar filters={filterOptions} onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des plateformes...</p>
            </div>
          ) : platforms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune plateforme trouvée pour cette catégorie.</p>
            </div>
          ) : (
            <>
              {/* Comparison Table */}
              <div className="glass rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Comparaison rapide</h2>
                <ComparisonTable
                  platforms={platforms}
                  columns={['Niveau', 'Format', 'Support', 'Prix']}
                />
              </div>

              {/* Platform Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {platforms.map((platform) => (
                  <PlatformCard key={platform.id} {...platform} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}




