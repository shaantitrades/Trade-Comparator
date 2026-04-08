// Database access via internal Next.js API routes (no Supabase dependency)

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '' // browser: use relative path
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// Types pour la base de données
export interface PlatformDB {
  id: string
  name: string
  slug: string
  category: string
  rating: number
  ratings: {
    sécurité: number
    frais: number
    actifs: number
    plateforme: number
    support: number
  }
  advantages: string[]
  disadvantages: string[]
  regulations: string[]
  min_deposit: number
  affiliate_url: string
  spread?: string
  leverage?: string
  platform?: string[]
  description?: string
  website?: string
  logo?: string
  // Nouveaux champs
  reviews?: number
  country?: string
  country_name?: string
  years_in_operation?: number
  assets?: string[]
  max_allocations?: string
  promo?: string
  promo_type?: string
  bonus_code?: string
  created_at?: string
  updated_at?: string
}

// Types pour les articles de blog
export interface BlogPostDB {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  author?: string
  cover_image?: string
  locale?: string
  published: boolean
  published_at?: string
  created_at?: string
  updated_at?: string
  tags?: string[]
  category?: string
}

// ─── Platform functions ────────────────────────────────────────────────────

export async function getPlatforms(category?: string) {
  try {
    const base = getBaseUrl()
    const path = category
      ? `/api/platforms?category=${encodeURIComponent(category)}`
      : '/api/platforms'
    const res = await fetch(`${base}${path}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return []
  }
}

export async function getPlatform(slug: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/platforms/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching platform:', error)
    return null
  }
}

export async function createPlatform(platform: Omit<PlatformDB, 'id' | 'created_at' | 'updated_at'>) {
  const res = await fetch(`${getBaseUrl()}/api/platforms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(platform),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error creating platform')
  }
  return res.json()
}

export async function updatePlatform(id: string, platform: Partial<PlatformDB>) {
  const res = await fetch(`${getBaseUrl()}/api/platforms/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(platform),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error updating platform')
  }
  return res.json()
}

export async function deletePlatform(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/platforms/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error deleting platform')
  }
}

// ─── Blog functions ────────────────────────────────────────────────────────

export async function getBlogPosts(locale?: string, publishedOnly: boolean = true) {
  try {
    const base = getBaseUrl()
    const params = new URLSearchParams()
    if (locale) params.set('locale', locale)
    if (!publishedOnly) params.set('all', 'true')
    const query = params.toString()
    const path = query ? `/api/blog?${query}` : '/api/blog'
    const res = await fetch(`${base}${path}`, {
      cache: 'no-store',
      credentials: 'include',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/blog/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function createBlogPost(post: Omit<BlogPostDB, 'id' | 'created_at' | 'updated_at'>) {
  const res = await fetch(`${getBaseUrl()}/api/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error creating blog post')
  }
  return res.json()
}

export async function updateBlogPost(id: string, post: Partial<BlogPostDB>) {
  const res = await fetch(`${getBaseUrl()}/api/blog/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error updating blog post')
  }
  return res.json()
}

export async function deleteBlogPost(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/blog/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error deleting blog post')
  }
}









