import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function isAdmin(request: NextRequest): boolean {
  return !!request.cookies.get('admin_token')?.value
}

// GET /api/platforms?category=trading
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let queryText = 'SELECT * FROM platforms ORDER BY rating DESC'
    const params: any[] = []

    if (category) {
      queryText = 'SELECT * FROM platforms WHERE category = $1 ORDER BY rating DESC'
      params.push(category)
    }

    const { rows } = await pool.query(queryText, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('GET /api/platforms error:', error)
    return NextResponse.json([], { status: 500 })
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
         max_allocations, promo, promo_type, bonus_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
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
      ]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/platforms error:', error)
    let msg = error.message || 'Unknown error'
    if (error.code === 'EAI_AGAIN' || msg.includes('EAI_AGAIN') || msg.includes('getaddrinfo')) {
      msg = `Impossible de résoudre le hostname de la base de données (${msg}). Vérifiez DATABASE_URL dans Coolify — le hostname doit correspondre au nom interne du service PostgreSQL.`
    } else if (msg.includes('ECONNREFUSED')) {
      msg = `Connexion refusée par PostgreSQL (${msg}). Vérifiez que le service PostgreSQL est démarré dans Coolify.`
    } else if (msg.includes('connection timeout') || msg.includes('ETIMEDOUT')) {
      msg = `Timeout de connexion PostgreSQL (${msg}). Vérifiez que DATABASE_URL est correct et que le service est accessible.`
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
