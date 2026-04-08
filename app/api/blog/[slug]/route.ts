import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function isAdmin(request: NextRequest): boolean {
  return !!request.cookies.get('admin_token')?.value
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/blog/[slug] — public (published only)
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const col = UUID_RE.test(slug) ? 'id' : 'slug'
    const { rows } = await pool.query(
      `SELECT * FROM blog_posts WHERE ${col} = $1 AND published = true LIMIT 1`,
      [slug]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('GET /api/blog/[slug] error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/blog/[id] — admin only
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

    // If being published for the first time, set published_at
    let publishedAt: string | null = null
    if (p.published) {
      const { rows: existing } = await pool.query(
        `SELECT published_at FROM blog_posts WHERE ${col} = $1 LIMIT 1`,
        [slug]
      )
      publishedAt = existing[0]?.published_at ?? new Date().toISOString()
    }

    const { rows } = await pool.query(
      `UPDATE blog_posts SET
        title=$1, slug=$2, excerpt=$3, content=$4, author=$5,
        cover_image=$6, locale=$7, published=$8, published_at=$9,
        tags=$10, category=$11, updated_at=NOW()
       WHERE ${col}=$12
       RETURNING *`,
      [
        p.title, p.slug, p.excerpt ?? null, p.content, p.author ?? 'Admin',
        p.cover_image ?? null, p.locale ?? 'fr', p.published ?? false, publishedAt,
        p.tags ?? [], p.category ?? 'trading',
        slug,
      ]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error('PUT /api/blog/[slug] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/blog/[id] — admin only
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
    await pool.query(`DELETE FROM blog_posts WHERE ${col} = $1`, [slug])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/blog/[slug] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
