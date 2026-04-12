'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { GradientBackground } from '@/components/shared/GradientBackground'
import { TrendingUp, Shield, Globe, Users, Bitcoin, Building2, Radio, GraduationCap, ArrowRight } from 'lucide-react'
import { TopPlatformsShowcase } from '@/components/comparisons/TopPlatformsShowcase'

export default function HomePage() {
  const t = useTranslations('common')
  const locale = useLocale()

  const stats = [
    { icon: TrendingUp, value: 150, label: t('stats.platforms') },
    { icon: Globe, value: 80, label: t('stats.countries') },
    { icon: Shield, value: 5000, label: t('stats.reviews') },
    { icon: Users, value: 250000, label: t('stats.users') },
  ]

  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-6 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 gradient-text scale-[0.99]"
            >
              {t('hero.title')}
            </motion.h1>
            

          </motion.div>

        </div>
      </section>

      {/* Preview Sections */}
      <TopPlatformsShowcase />

      <section id="categories-section" className="py-4 sm:py-6 md:py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[
              { 
                key: 'trading', 
                label: 'trading', 
                subtitleKey: 'categories.compareBest',
                icon: TrendingUp,
                gradient: 'from-blue-500/50 to-cyan-500/40',
                iconColor: 'text-blue-300'
              },
              { 
                key: 'crypto', 
                label: 'crypto', 
                subtitleKey: 'categories.compareBest',
                icon: Bitcoin,
                gradient: 'from-yellow-500/50 to-orange-500/40',
                iconColor: 'text-yellow-300'
              },
              { 
                key: 'propFirms', 
                label: 'prop-firms', 
                subtitleKey: 'categories.compareBest',
                icon: Building2,
                gradient: 'from-purple-500/50 to-pink-500/40',
                iconColor: 'text-purple-300'
              },

              { 
                key: 'signals', 
                label: 'signals', 
                subtitleKey: 'categories.signalsSubtitle',
                icon: Radio,
                gradient: 'from-green-500/50 to-emerald-500/40',
                iconColor: 'text-green-300'
              },
              { 
                key: 'education', 
                label: 'education', 
                subtitleKey: 'categories.educationSubtitle',
                icon: GraduationCap,
                gradient: 'from-indigo-500/50 to-violet-500/40',
                iconColor: 'text-indigo-300'
              },
            ].map((category, index) => {
              const href = category.key === 'trading' ? '/trading' :
                          category.key === 'crypto' ? '/crypto' :
                          category.key === 'propFirms' ? '/prop-firms' :
                          category.key === 'binaryOptions' ? '/binary-options' :
                          category.key === 'signals' ? '/signals' :
                          '/education'
              
              const Icon = category.icon
              
              return (
                <Link
                  key={category.key}
                  href={`/${locale}${href}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`glass rounded-lg p-4 sm:p-5 md:p-6 hover:scale-105 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br ${category.gradient} border border-white/25 shadow-lg`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg bg-white/20 backdrop-blur-sm ${category.iconColor}`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                          {t(`nav.${category.key}`)}
                        </h3>
                        </div>
                        <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black/20">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {t(category.subtitleKey)}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - Au-dessus du footer */}
      <section className="py-12 sm:py-16 md:py-20 px-4 border-t border-border">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-lg p-6 text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

