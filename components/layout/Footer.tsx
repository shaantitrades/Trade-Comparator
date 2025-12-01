'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export function Footer() {
  const t = useTranslations('common')
  const locale = useLocale()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">Trade Comparator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/trading`} className="hover:text-primary transition-colors">
                  {t('nav.trading')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/crypto`} className="hover:text-primary transition-colors">
                  {t('nav.crypto')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/prop-firms`} className="hover:text-primary transition-colors">
                  {t('nav.propFirms')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/binary-options`} className="hover:text-primary transition-colors">
                  {t('nav.binaryOptions')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/legal/terms`} className="hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/privacy`} className="hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/disclaimer`} className="hover:text-primary transition-colors">
                  {t('footer.disclaimer')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.contactText')}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Trade Comparator. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}




