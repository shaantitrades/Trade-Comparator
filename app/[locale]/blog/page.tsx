'use client'

import { useTranslations } from 'next-intl'

export default function BlogPage() {
  const t = useTranslations('common')

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>
      <p className="text-muted-foreground">
        Articles et guides sur le trading
      </p>
    </div>
  )
}






