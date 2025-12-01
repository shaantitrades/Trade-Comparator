'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ComparisonTable } from '@/components/comparisons/ComparisonTable'
import { PlatformCard } from '@/components/comparisons/PlatformCard'
import { FilterSidebar } from '@/components/comparisons/FilterSidebar'
import { getPlatforms } from '@/lib/supabase'
import { Platform } from '@/types'

export default function TradingPage() {
  const t = useTranslations('common')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await getPlatforms('trading')
        // Convertir le format Supabase vers le format frontend
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
      id: 'regulation',
      label: 'Régulation',
      type: 'checkbox' as const,
      options: ['FCA', 'CySEC', 'ASIC', 'BaFin', 'FINMA'],
    },
    {
      id: 'minDeposit',
      label: 'Dépôt minimum',
      type: 'range' as const,
      min: 0,
      max: 1000,
    },
    {
      id: 'platform',
      label: 'Plateforme',
      type: 'checkbox' as const,
      options: ['MT4', 'MT5', 'Web', 'Mobile', 'Propriétaire'],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Plateformes de Trading Forex</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Comparez les meilleures plateformes de trading Forex avec des données transparentes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <FilterSidebar filters={filterOptions} onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-5 md:space-y-6 order-1 lg:order-2">
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
              <div className="glass rounded-lg p-4 sm:p-5 md:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Comparaison rapide</h2>
                <ComparisonTable
                  platforms={platforms}
                  columns={['Dépôt min', 'Spread', 'Effet de levier', 'Régulation', 'Plateforme']}
                />
              </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
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




