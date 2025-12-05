'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { getPlatforms } from '@/lib/supabase'
import { PlatformTable } from '@/components/comparisons/PlatformTable'
import { Platform } from '@/types'

export default function BinaryOptionsPage() {
  const t = useTranslations('common')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await getPlatforms('binary-options')
        // Les données sont déjà normalisées par getPlatforms()
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
          advantages: Array.isArray(p.advantages) ? p.advantages : [],
          disadvantages: Array.isArray(p.disadvantages) ? p.disadvantages : [],
          regulations: Array.isArray(p.regulations) ? p.regulations : [],
          minDeposit: p.min_deposit || 0,
          affiliateUrl: p.affiliate_url || '',
          spread: p.spread,
          leverage: p.leverage,
          platform: Array.isArray(p.platform) ? p.platform : [],
          assets: Array.isArray(p.assets) ? p.assets : [],
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

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Plateformes d&apos;Options Binaires</h1>
        <p className="text-muted-foreground">
          Comparez les plateformes d&apos;options binaires
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des plateformes...</p>
        </div>
      ) : platforms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune plateforme trouvée pour cette catégorie.</p>
        </div>
      ) : (
        <PlatformTable platforms={platforms} />
      )}
    </div>
  )
}




