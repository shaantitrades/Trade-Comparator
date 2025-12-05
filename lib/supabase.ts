import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// Fonction utilitaire pour normaliser les tableaux PostgreSQL
// Les tableaux TEXT[] peuvent être renvoyés comme des strings ou des tableaux
function normalizeArray(value: any): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    // Filtrer les valeurs vides, null et undefined
    return value
      .filter((item) => item != null)
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter((item) => item !== '')
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []
    // Si c'est une string, essayer de la parser comme JSON
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item != null)
          .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
          .filter((item) => item !== '')
      }
      // Si ce n'est pas un tableau mais une valeur valide, retourner un tableau
      return [String(parsed).trim()].filter((item) => item !== '')
    } catch {
      // Si ce n'est pas du JSON valide, retourner un tableau avec la string
      return trimmed !== '' ? [trimmed] : []
    }
  }
  return []
}

// Fonction utilitaire pour normaliser les ratings JSONB
function normalizeRatings(value: any): {
  sécurité: number
  frais: number
  actifs: number
  plateforme: number
  support: number
} {
  const defaultRatings = {
    sécurité: 0,
    frais: 0,
    actifs: 0,
    plateforme: 0,
    support: 0,
  }

  if (!value) return defaultRatings
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return { ...defaultRatings, ...parsed }
    } catch {
      return defaultRatings
    }
  }
  if (typeof value === 'object') {
    return { ...defaultRatings, ...value }
  }
  return defaultRatings
}

// Fonctions utilitaires pour les plateformes
export async function getPlatforms(category?: string) {
  let query = supabase.from('platforms').select('*').order('rating', { ascending: false })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching platforms:', error)
    return []
  }
  
  if (!data) return []
  
  // Normaliser les données récupérées
  return data.map((p: any) => ({
    ...p,
    advantages: normalizeArray(p.advantages),
    disadvantages: normalizeArray(p.disadvantages),
    regulations: normalizeArray(p.regulations),
    platform: normalizeArray(p.platform),
    assets: normalizeArray(p.assets),
    ratings: normalizeRatings(p.ratings),
  }))
}

export async function getPlatform(slug: string) {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching platform:', error)
    return null
  }
  
  if (!data) return null
  
  // Normaliser les données récupérées
  return {
    ...data,
    advantages: normalizeArray(data.advantages),
    disadvantages: normalizeArray(data.disadvantages),
    regulations: normalizeArray(data.regulations),
    platform: normalizeArray(data.platform),
    assets: normalizeArray(data.assets),
    ratings: normalizeRatings(data.ratings),
  }
}

export async function createPlatform(platform: Omit<PlatformDB, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('platforms')
    .insert(platform)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating platform:', error)
    throw error
  }
  
  return data
}

export async function updatePlatform(id: string, platform: Partial<PlatformDB>) {
  const { data, error } = await supabase
    .from('platforms')
    .update({ ...platform, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating platform:', error)
    throw error
  }
  
  return data
}

export async function deletePlatform(id: string) {
  const { error } = await supabase
    .from('platforms')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting platform:', error)
    throw error
  }
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

// Fonctions pour les articles de blog
export async function getBlogPosts(locale?: string, publishedOnly: boolean = true) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (publishedOnly) {
    query = query.eq('published', true)
  }
  
  if (locale) {
    query = query.eq('locale', locale)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  
  return data || []
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return data
}

export async function createBlogPost(post: Omit<BlogPostDB, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      published_at: post.published ? new Date().toISOString() : null,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating blog post:', error)
    throw error
  }
  
  return data
}

export async function updateBlogPost(id: string, post: Partial<BlogPostDB>) {
  const updateData: any = { ...post }
  
  // Si on passe de non publié à publié, mettre à jour published_at
  if (post.published === true) {
    // Vérifier si l'article était déjà publié
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single()
    
    if (!existing?.published_at) {
      updateData.published_at = new Date().toISOString()
    }
  }
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating blog post:', error)
    throw error
  }
  
  return data
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting blog post:', error)
    throw error
  }
}








