'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Users, CheckCircle, RefreshCw, ExternalLink, TrendingUp, Bitcoin, Building2, GraduationCap, Radio } from 'lucide-react'
import { Platform } from '@/types'

const CATEGORIES = [
  { key: 'trading', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40', activeBg: 'bg-blue-600' },
  { key: 'crypto', icon: Bitcoin, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', activeBg: 'bg-yellow-600' },
  { key: 'prop-firms', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40', activeBg: 'bg-purple-600' },
  { key: 'education', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', activeBg: 'bg-indigo-600' },
  { key: 'signals', icon: Radio, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/40', activeBg: 'bg-green-600' },
]

function formatPopularity(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

function getUpdatedLabel(): string {
  const d = new Date()
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

interface PlatformShowcaseCardProps {
  platform: Platform
  t: any
  locale: string
  catKey: string
}

function PlatformShowcaseCard({ platform, t, locale, catKey }: PlatformShowcaseCardProps) {
  const score = typeof platform.rating === 'number' ? platform.rating : 0
  const popularity = platform.popularity ?? 0
  const countryCode = platform.availableCountry || platform.country || 'FR'
  const riskDisclaimer = platform.riskDisclaimer
  const updatedLabel = getUpdatedLabel()

  const href = `/${locale}/${catKey === 'prop-firms' ? 'prop-firms' : catKey}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex flex-col bg-card border border-border rounded-xl overflow-hidden min-w-[180px] max-w-[220px] w-full flex-shrink-0 shadow-md hover:shadow-lg hover:border-primary/40 transition-all duration-200"
    >
      {/* Logo */}
      <div className="flex items-center justify-center bg-white h-20 px-4">
        {platform.logo ? (
          <img
            src={platform.logo}
            alt={platform.name}
            className="h-12 w-auto max-w-[120px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
              const parent = (e.target as HTMLImageElement).parentElement
              if (parent) {
                const fallback = document.createElement('span')
                fallback.textContent = platform.name[0]
                fallback.className = 'text-2xl font-bold text-gray-800'
                parent.appendChild(fallback)
              }
            }}
          />
        ) : (
          <span className="text-3xl font-bold text-gray-800">{platform.name[0]}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="font-bold text-sm text-foreground text-center">{platform.name}</h3>

        {/* Score */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          <span className="font-semibold text-foreground">{t('showcase.score')} {score.toFixed(1)}/5</span>
        </div>

        {/* Popularité */}
        {popularity > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span><span className="font-semibold text-foreground">{t('showcase.popularity')}</span> {formatPopularity(popularity)}</span>
          </div>
        )}

        {/* Disponible */}
        <div className="flex items-center gap-1.5 text-xs text-green-400">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{t(`showcase.availableIn.${countryCode}`, { fallback: t('showcase.availableDefault') })}</span>
        </div>

        {/* Mis à jour */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3 flex-shrink-0" />
          <span>{t('showcase.updatedAt')} {updatedLabel}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="p-3 pt-0 flex flex-col gap-1.5">
        <a
          href={platform.affiliateUrl || href}
          target={platform.affiliateUrl ? '_blank' : '_self'}
          rel={platform.affiliateUrl ? 'noopener noreferrer sponsored' : undefined}
          className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors duration-150"
        >
          {t('showcase.visitBroker')}
          <ExternalLink className="w-3 h-3" />
        </a>
        {riskDisclaimer && (
          <p className="text-[10px] text-muted-foreground text-center leading-tight">{riskDisclaimer}</p>
        )}
      </div>
    </motion.div>
  )
}

export function TopPlatformsShowcase() {
  const t = useTranslations('common')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<string>('trading')
  const [platformsByCategory, setPlatformsByCategory] = useState<Record<string, Platform[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            try {
              const res = await fetch(`/api/platforms?category=${cat.key}&featured=true`)
              if (!res.ok) return [cat.key, [] as Platform[]] as const
              const rows: any[] = await res.json()
              const formatted: Platform[] = rows.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                category: p.category,
                rating: Number(p.rating) || 0,
                ratings: p.ratings || { sécurité: 0, frais: 0, actifs: 0, plateforme: 0, support: 0 },
                advantages: p.advantages ?? [],
                disadvantages: p.disadvantages ?? [],
                regulations: p.regulations ?? [],
                minDeposit: p.min_deposit ?? 0,
                affiliateUrl: p.affiliate_url ?? '',
                logo: p.logo ?? undefined,
                isFeatured: p.is_featured ?? false,
                popularity: p.popularity ?? 0,
                riskDisclaimer: p.risk_disclaimer ?? undefined,
                availableCountry: p.available_country ?? 'FR',
                featuredOrder: p.featured_order ?? 0,
                country: p.country ?? undefined,
              }))
              return [cat.key, formatted] as const
            } catch {
              return [cat.key, [] as Platform[]] as const
            }
          })
        )
        const map: Record<string, Platform[]> = {}
        results.forEach(([key, platforms]) => { map[key] = platforms })
        setPlatformsByCategory(map)

        // Activer la première catégorie qui a des plateformes
        const firstWithData = CATEGORIES.find(c => (map[c.key]?.length ?? 0) > 0)
        if (firstWithData) setActiveCategory(firstWithData.key)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const activePlatforms = platformsByCategory[activeCategory] ?? []
  const activeCat = CATEGORIES.find(c => c.key === activeCategory)!

  const hasAnyData = CATEGORIES.some(c => (platformsByCategory[c.key]?.length ?? 0) > 0)

  return (
    <section className="w-full px-4 py-6 sm:py-8">
      <div className="container mx-auto">

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            {t('showcase.title')}
          </h2>
        </motion.div>

        {/* Tabs catégories */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.key
            const count = platformsByCategory[cat.key]?.length ?? 0
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? `${cat.activeBg} text-white border-transparent shadow-md`
                    : `${cat.bg} ${cat.color} ${cat.border} hover:opacity-80`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t(`nav.${cat.key === 'prop-firms' ? 'propFirms' : cat.key === 'signals' ? 'signals' : cat.key}`)}</span>
                <span className="sm:hidden">{t(`showcase.tabShort.${cat.key === 'prop-firms' ? 'propFirms' : cat.key === 'signals' ? 'signals' : cat.key}`)}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-black/20'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div className="relative">          {loading ? (
            <div className="flex gap-3 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[180px] max-w-[220px] h-64 bg-card border border-border rounded-xl animate-pulse flex-shrink-0" />
              ))}
            </div>
          ) : activePlatforms.length > 0 ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3 min-w-max sm:min-w-0 sm:flex-wrap"
                >
                  {activePlatforms.map((platform) => (
                    <PlatformShowcaseCard
                      key={platform.id}
                      platform={platform}
                      t={t}
                      locale={locale}
                      catKey={activeCategory}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-3 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[180px] max-w-[220px] flex-shrink-0 bg-card border border-dashed border-border rounded-xl overflow-hidden opacity-40">
                  <div className="h-20 bg-white/5 flex items-center justify-center">
                    <div className="w-16 h-8 bg-white/10 rounded" />
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-white/10 rounded w-3/5" />
                  </div>
                  <div className="p-3 pt-0">
                    <div className="h-8 bg-blue-600/30 rounded-lg" />
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-1.5 rounded-full border border-border">
                  {t('showcase.noFeatured')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
