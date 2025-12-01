'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { GradientBackground } from '@/components/shared/GradientBackground'
import { TrendingUp, Shield, Globe, Users, Bitcoin, Building2, Target, Radio, GraduationCap } from 'lucide-react'

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
      <section className="relative pt-32 pb-20 px-4">
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 gradient-text"
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 md:mb-4 px-4"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8 px-4"
            >
              {t('hero.description')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            >
              <Button size="lg" variant="gradient" className="text-lg px-8 py-6">
                {t('cta.findPlatform')}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                {t('cta.learnMore')}
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Preview Sections */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
            Explorez nos catégories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              { 
                key: 'trading', 
                label: 'trading', 
                subtitleKey: 'categories.compareBest',
                icon: TrendingUp,
                gradient: 'from-blue-500/20 to-cyan-500/20',
                iconColor: 'text-blue-400'
              },
              { 
                key: 'crypto', 
                label: 'crypto', 
                subtitleKey: 'categories.compareBest',
                icon: Bitcoin,
                gradient: 'from-yellow-500/20 to-orange-500/20',
                iconColor: 'text-yellow-400'
              },
              { 
                key: 'propFirms', 
                label: 'prop-firms', 
                subtitleKey: 'categories.compareBest',
                icon: Building2,
                gradient: 'from-purple-500/20 to-pink-500/20',
                iconColor: 'text-purple-400'
              },
              { 
                key: 'binaryOptions', 
                label: 'binary-options', 
                subtitleKey: 'categories.compareBest',
                icon: Target,
                gradient: 'from-green-500/20 to-emerald-500/20',
                iconColor: 'text-green-400'
              },
              { 
                key: 'signals', 
                label: 'signals', 
                subtitleKey: 'categories.signalsSubtitle',
                icon: Radio,
                gradient: 'from-green-500/30 to-emerald-500/30',
                iconColor: 'text-green-400'
              },
              { 
                key: 'education', 
                label: 'education', 
                subtitleKey: 'categories.educationSubtitle',
                icon: GraduationCap,
                gradient: 'from-indigo-500/20 to-violet-500/20',
                iconColor: 'text-indigo-400'
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
                    className={`glass rounded-lg p-4 sm:p-5 md:p-6 hover:scale-105 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br ${category.gradient} border border-white/10`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-sm ${category.iconColor}`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                          {t(`nav.${category.key}`)}
                        </h3>
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

