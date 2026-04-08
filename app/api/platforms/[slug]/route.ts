import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function isAdmin(request: NextRequest): boolean {
  return !!request.cookies.get('admin_token')?.value
}

// UUID regex helper
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/platforms/[slug] — public
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const col = UUID_RE.test(slug) ? 'id' : 'slug'
    const { rows } = await pool.query(
      `SELECT * FROM platforms WHERE ${col} = $1 LIMIT 1`,
      [slug]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('GET /api/platforms/[slug] error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/platforms/[id] — admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = params
    const col = UUID_RE.test(slug) ? 'id' : 'slug'
    const p = await request.json()

    const { rows } = await pool.query(
      `UPDATE platforms SET
        name=$1, slug=$2, category=$3, rating=$4, ratings=$5,
        advantages=$6, disadvantages=$7, regulations=$8,
        min_deposit=$9, affiliate_url=$10, spread=$11, leverage=$12,
        platform=$13, description=$14, website=$15, logo=$16,
        reviews=$17, country=$18, country_name=$19, years_in_operation=$20,
        assets=$21, max_allocations=$22, promo=$23, promo_type=$24, bonus_code=$25,
        updated_at=NOW()
       WHERE ${col}=$26
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
        slug,
      ]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error('PUT /api/platforms/[slug] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/platforms/[id] — admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = params
    const col = UUID_RE.test(slug) ? 'id' : 'slug'
    await pool.query(`DELETE FROM platforms WHERE ${col} = $1`, [slug])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/platforms/[slug] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
