import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Trade Comparator - Comparateur de Plateformes de Trading',
  description: 'Comparez les meilleures plateformes de trading : Forex, Crypto, Prop Firms et Options Binaires. Données à jour, avis vérifiés.',
  keywords: 'trading, forex, crypto, comparaison, plateformes',
  verification: {
    google: 'o96Blh7AgUihtyl2bEuKBF1EKadtl8NU1OAf7sTEz8Q',
  },
  other: {
    'google-adsense-account': 'ca-pub-5343389597650456',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
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
