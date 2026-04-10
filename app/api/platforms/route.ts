import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function isAdmin(request: NextRequest): boolean {
  return !!request.cookies.get('admin_token')?.value
}

function extractError(error: any): string {
  const code = error?.code || ''
  const msg = error?.message || error?.detail || error?.hint || ''
  const full = msg || JSON.stringify(error) || 'Erreur inconnue'
  if (!process.env.DATABASE_URL) {
    return 'DATABASE_URL non défini. Ajoutez cette variable dans Coolify → Environment Variables.'
  }
  if (code === 'EAI_AGAIN' || full.includes('EAI_AGAIN') || full.includes('getaddrinfo')) {
    return `DNS: impossible de résoudre le hostname PostgreSQL. Dans Coolify, vérifiez DATABASE_URL — utilisez le hostname interne exact du service PostgreSQL. Détail: ${full}`
  }
  if (code === 'ECONNREFUSED' || full.includes('ECONNREFUSED')) {
    return `Connexion refusée par PostgreSQL. Vérifiez que le service PostgreSQL est démarré. Détail: ${full}`
  }
  if (code === 'ETIMEDOUT' || full.includes('timeout')) {
    return `Timeout PostgreSQL. Vérifiez le hostname dans DATABASE_URL. Détail: ${full}`
  }
  if (code === '23505') return `Slug ou champ unique déjà existant. Détail: ${full}`
  if (code === '42P01') return `La table "platforms" n'existe pas. Exécutez le script SQL dans Coolify. Détail: ${full}`
  return full
}

// GET /api/platforms?category=trading&featured=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let queryText = 'SELECT * FROM platforms ORDER BY rating DESC'
    const params: any[] = []

    if (category && featured === 'true') {
      queryText = 'SELECT * FROM platforms WHERE category = $1 AND is_featured = TRUE ORDER BY featured_order ASC, rating DESC'
      params.push(category)
    } else if (category) {
      queryText = 'SELECT * FROM platforms WHERE category = $1 ORDER BY rating DESC'
      params.push(category)
    } else if (featured === 'true') {
      queryText = 'SELECT * FROM platforms WHERE is_featured = TRUE ORDER BY category ASC, featured_order ASC, rating DESC'
    }

    const { rows } = await pool.query(queryText, params)
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error('GET /api/platforms error:', error)
    return NextResponse.json({ error: extractError(error) }, { status: 500 })
  }
}

// POST /api/platforms — admin only
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const p = await request.json()

    const { rows } = await pool.query(
      `INSERT INTO platforms
        (name, slug, category, rating, ratings, advantages, disadvantages, regulations,
         min_deposit, affiliate_url, spread, leverage, platform, description, website, logo,
         reviews, country, country_name, years_in_operation, assets,
         max_allocations, promo, promo_type, bonus_code,
         is_featured, popularity, risk_disclaimer, available_country, featured_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)
       RETURNING *`,
      [
        p.name, p.slug, p.category, p.rating ?? 0,
        JSON.stringify(p.ratings ?? { sécurité: 0, frais: 0, actifs: 0, plateforme: 0, support: 0 }),
        p.advantages ?? [], p.disadvantages ?? [], p.regulations ?? [],
        p.min_deposit ?? 0, p.affiliate_url,
        p.spread ?? null, p.leverage ?? null, p.platform ?? [],
        p.description ?? null, p.website ?? null, p.logo ?? null,
        p.reviews ?? 0, p.country ?? null, p.country_name ?? null,
        p.years_in_operation ?? null, p.assets ?? [],
        p.max_allocations ?? null, p.promo ?? null, p.promo_type ?? null, p.bonus_code ?? null,
        p.is_featured ?? false, p.popularity ?? 0, p.risk_disclaimer ?? null,
        p.available_country ?? 'FR', p.featured_order ?? 0,
      ]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/platforms error:', error)
    return NextResponse.json({ error: extractError(error) }, { status: 500 })
  }
}
