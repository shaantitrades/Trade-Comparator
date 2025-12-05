import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { locales, Locale } from '@/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Génère les métadonnées SEO dynamiques pour chaque locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  if (!locales.includes(locale as Locale)) {
    return {}
  }
  
  return generateSEOMetadata(locale as Locale)
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
