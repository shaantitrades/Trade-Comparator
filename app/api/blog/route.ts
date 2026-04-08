import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function isAdmin(request: NextRequest): boolean {
  return !!request.cookies.get('admin_token')?.value
}

// GET /api/blog?locale=fr&all=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const all = searchParams.get('all') === 'true'

    // Only admins can see unpublished posts
    const showAll = all && isAdmin(request)

    const conditions: string[] = []
    const params: any[] = []

    if (!showAll) {
      conditions.push(`published = true`)
    }
    if (locale) {
      params.push(locale)
      conditions.push(`locale = $${params.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const queryText = `SELECT * FROM blog_posts ${where} ORDER BY COALESCE(published_at, created_at) DESC`

    const { rows } = await pool.query(queryText, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('GET /api/blog error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST /api/blog — admin only
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const p = await request.json()
    const publishedAt = p.published ? new Date().toISOString() : null

    const { rows } = await pool.query(
      `INSERT INTO blog_posts
        (title, slug, excerpt, content, author, cover_image, locale,
         published, published_at, tags, category)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        p.title, p.slug, p.excerpt ?? null, p.content,
        p.author ?? 'Admin', p.cover_image ?? null, p.locale ?? 'fr',
        p.published ?? false, publishedAt,
        p.tags ?? [], p.category ?? 'trading',
      ]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/blog error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
