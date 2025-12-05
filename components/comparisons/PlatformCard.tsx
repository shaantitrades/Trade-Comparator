'use client'

import { motion } from 'framer-motion'
import { Star, Check, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RegulationBadge } from './RegulationBadge'
import { cn } from '@/lib/utils'

interface PlatformRating {
  sécurité: number
  frais: number
  actifs: number
  plateforme: number
  support: number
}

interface PlatformCardProps {
  name: string
  logo?: string
  rating: number
  ratings: PlatformRating
  advantages: string[]
  disadvantages: string[]
  regulations: string[]
  minDeposit: number
  affiliateUrl: string
  className?: string
}

export function PlatformCard({
  name,
  logo,
  rating,
  ratings,
  advantages,
  disadvantages,
  regulations,
  minDeposit,
  affiliateUrl,
  className,
}: PlatformCardProps) {
  const averageRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={cn('glass rounded-lg p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4', className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {logo && (
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold">{name[0]}</span>
            </div>
          )}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold">{name}</h3>
            <div className="flex items-center space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  )}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regulations */}
      {regulations && regulations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {regulations.map((reg) => (
            <RegulationBadge key={reg} regulation={reg} />
          ))}
        </div>
      )}

      {/* Min Deposit */}
      <div className="text-sm">
        <span className="text-muted-foreground">Dépôt minimum: </span>
        <span className="font-semibold">{minDeposit}€</span>
      </div>

      {/* Advantages */}
      {advantages && advantages.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-400">Avantages</h4>
          <ul className="space-y-1">
            {advantages.map((advantage, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disadvantages */}
      {disadvantages && disadvantages.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2 text-red-400">Inconvénients</h4>
          <ul className="space-y-1">
            {disadvantages.map((disadvantage, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm">
                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>{disadvantage}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <Button
        variant="gradient"
        className="w-full"
        onClick={() => window.open(affiliateUrl, '_blank')}
      >
        Voir la plateforme
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  )
}




