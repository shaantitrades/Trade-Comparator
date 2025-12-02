import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'admin@trades.com'
const ADMIN_PASSWORD = 'admin0080'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Créer un token simple (en production, utilisez JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      
      const response = NextResponse.json({ 
        success: true, 
        token,
        message: 'Authentification réussie' 
      })
      
      // Définir un cookie sécurisé
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Email ou mot de passe incorrect' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'authentification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (token) {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Déconnexion réussie' })
  response.cookies.delete('admin_token')
  return response
}



