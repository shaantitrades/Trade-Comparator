'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ExternalLink, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Platform } from '@/types'

interface PlatformTableProps {
  platforms: Platform[]
  className?: string
}

// Liste des codes pays courants avec leurs emojis de drapeau
const countryFlags: Record<string, string> = {
  FR: '🇫🇷',
  US: '🇺🇸',
  GB: '🇬🇧',
  DE: '🇩🇪',
  ES: '🇪🇸',
  IT: '🇮🇹',
  NL: '🇳🇱',
  AE: '🇦🇪',
  CH: '🇨🇭',
  AU: '🇦🇺',
  CA: '🇨🇦',
  JP: '🇯🇵',
  CN: '🇨🇳',
  SG: '🇸🇬',
  CY: '🇨🇾',
}

// Couleurs par type d'asset
const assetColors: Record<string, string> = {
  Crypto: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  FX: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Indices: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Metals: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Energy: 'bg-green-500/20 text-green-300 border-green-500/30',
  'Other Commodities': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
}

export function PlatformTable({ platforms, className }: PlatformTableProps) {
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState<'all' | 'popular' | 'new'>('all')

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('desc')
    }
  }

  // Calculer la note moyenne pour le tri
  const getAverageRating = (platform: Platform) => {
    if (!platform.ratings) return platform.rating || 0
    const values = Object.values(platform.ratings)
    return values.reduce((a, b) => a + b, 0) / values.length
  }

  // Trier les plateformes
  const sortedPlatforms = [...platforms].sort((a, b) => {
    if (!sortBy) return 0

    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'rating':
        aValue = getAverageRating(a)
        bValue = getAverageRating(b)
        break
      case 'reviews':
        aValue = a.reviews || 0
        bValue = b.reviews || 0
        break
      case 'years':
        aValue = a.yearsInOperation || 0
        bValue = b.yearsInOperation || 0
        break
      default:
        return 0
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Filtrer les plateformes
  const filteredPlatforms = sortedPlatforms.filter((platform) => {
    if (filter === 'popular') {
      return (platform.reviews || 0) > 100 || getAverageRating(platform) >= 4.0
    }
    if (filter === 'new') {
      return (platform.yearsInOperation || 999) <= 2
    }
    return true
  })

  const getCountryFlag = (countryCode?: string) => {
    if (!countryCode) return '🌍'
    return countryFlags[countryCode.toUpperCase()] || '🌍'
  }

  const formatMaxAllocations = (value?: string) => {
    if (!value) return '-'
    return value
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header avec filtres */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-primary text-primary-foreground' : ''}
          >
            Tous
          </Button>
          <Button
            variant={filter === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('popular')}
            className={filter === 'popular' ? 'bg-primary text-primary-foreground' : ''}
          >
            Populaires
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('new')}
            className={filter === 'new' ? 'bg-primary text-primary-foreground' : ''}
          >
            Nouveautés
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredPlatforms.length} plateforme{filteredPlatforms.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-full inline-block">
          <table className="w-full border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Plateforme
                </th>
                <th
                  className="text-left p-4 font-semibold text-sm uppercase tracking-wider cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSort('rating')}
                >
                  Note / Avis
                </th>
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Pays
                </th>
                <th
                  className="text-left p-4 font-semibold text-sm uppercase tracking-wider cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSort('years')}
                >
                  Années
                </th>
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Actifs
                </th>
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Plateformes
                </th>
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Allocation Max
                </th>
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Promo
                </th>
                <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlatforms.map((platform, index) => {
                const averageRating = getAverageRating(platform)
                const reviewsCount = platform.reviews || 0

                return (
                  <motion.tr
                    key={platform.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-border/30 hover:bg-accent/20 transition-colors"
                  >
                    {/* FIRM */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {platform.logo ? (
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold">{platform.name[0]}</span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-primary">
                              {platform.name[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{platform.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {platform.slug}
                          </div>
                        </div>
                        <button className="flex-shrink-0 p-1 hover:bg-accent/50 rounded transition-colors">
                          <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    </td>

                    {/* RANK / REVIEWS */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-4 h-4',
                                i < Math.round(averageRating)
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground/30'
                              )}
                            />
                          ))}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{averageRating.toFixed(1)}</div>
                          {reviewsCount > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {reviewsCount} avis{reviewsCount > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* COUNTRY */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getCountryFlag(platform.country)}</span>
                        <div>
                          <div className="text-sm font-medium">
                            {platform.country?.toUpperCase() || '-'}
                          </div>
                          {platform.countryName && (
                            <div className="text-xs text-muted-foreground">
                              {platform.countryName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* YEARS IN OPERATION */}
                    <td className="p-4">
                      {platform.yearsInOperation !== undefined && platform.yearsInOperation !== null ? (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {platform.yearsInOperation}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* ASSETS */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {platform.assets && platform.assets.length > 0 ? (
                          platform.assets.map((asset, i) => (
                            <span
                              key={i}
                              className={cn(
                                'text-xs px-2 py-1 rounded border',
                                assetColors[asset] ||
                                  'bg-muted text-muted-foreground border-border'
                              )}
                            >
                              {asset}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>

                    {/* PLATFORMS */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {platform.platform && platform.platform.length > 0 ? (
                          platform.platform.map((p, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center"
                              title={p}
                            >
                              <span className="text-xs font-bold">{p[0]}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>

                    {/* MAX ALLOCATIONS */}
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-semibold">
                          {formatMaxAllocations(platform.maxAllocations)}
                        </div>
                        {platform.maxAllocations && (
                          <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: '60%' }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* PROMO */}
                    <td className="p-4">
                      {platform.promo ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-semibold text-green-400">
                            {platform.promo}
                          </span>
                          {platform.promoType && (
                            <span className="text-xs px-2 py-0.5 bg-primary/20 rounded">
                              {platform.promoType}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(platform.affiliateUrl, '_blank')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Voir
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPlatforms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune plateforme trouvée.</p>
        </div>
      )}
    </div>
  )
}

