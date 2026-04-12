import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Les métadonnées SEO sont gérées dans app/[locale]/layout.tsx pour chaque langue
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Publisher ID depuis la balise meta ou variable d'environnement
  const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-5343389597650456'

  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  )
}
