'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { getPlatforms } from '@/lib/supabase'
import { PlatformCard } from '@/components/comparisons/PlatformCard'
import { Platform } from '@/types'

export default function CryptoPage() {
  const t = useTranslations('common')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await getPlatforms('crypto')
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

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('pages.crypto.title')}</h1>
        <p className="text-muted-foreground">
          {t('pages.crypto.description')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('pages.loading')}</p>
        </div>
      ) : platforms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('pages.empty')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} {...platform} />
          ))}
        </div>
      )}
    </div>
  )
}




