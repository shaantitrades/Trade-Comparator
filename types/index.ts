export interface Platform {
  id: string
  name: string
  slug: string
  logo?: string
  rating: number
  ratings: PlatformRating
  advantages: string[]
  disadvantages: string[]
  regulations: string[]
  minDeposit: number
  spread?: string
  leverage?: string
  platform?: string[]
  affiliateUrl: string
  category: 'trading' | 'crypto' | 'prop-firms' | 'binary-options'
  description?: string
  website?: string
  founded?: number
  headquarters?: string
}

export interface PlatformRating {
  sécurité: number
  frais: number
  actifs: number
  plateforme: number
  support: number
}

export interface Filter {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'select'
  options?: string[]
  min?: number
  max?: number
}








