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
  created_at?: string
  updated_at?: string
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
  
  return data || []
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
  
  return data
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






