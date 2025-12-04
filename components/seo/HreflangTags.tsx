'use client'

import { useEffect } from 'react'
import { Locale } from '@/i18n'
import { locales } from '@/i18n'

const baseUrl = 'https://tradecomparator.com'

export function HreflangTags({ locale }: { locale: Locale }) {
  useEffect(() => {
    // Supprimer les anciennes balises hreflang si elles existent
    const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]')
    existingTags.forEach((tag) => tag.remove())

    // Créer toutes les balises hreflang
    locales.forEach((loc) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.setAttribute('hreflang', loc)
      link.href = `${baseUrl}/${loc}`
      document.head.appendChild(link)
    })

    // Ajouter la balise x-default pointant vers l'anglais (version par défaut)
    const defaultLink = document.createElement('link')
    defaultLink.rel = 'alternate'
    defaultLink.setAttribute('hreflang', 'x-default')
    defaultLink.href = `${baseUrl}/en`
    document.head.appendChild(defaultLink)

    // Nettoyage lors du démontage
    return () => {
      const allHreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]')
      allHreflangTags.forEach((tag) => tag.remove())
    }
  }, [locale])

  return null
}

