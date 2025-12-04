'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { getBlogPosts, BlogPostDB } from '@/lib/supabase'

export default function BlogPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const [posts, setPosts] = useState<BlogPostDB[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getBlogPosts(locale, true) // Seulement les articles publiés
        setPosts(data || [])
      } catch (error) {
        console.error('Error loading blog posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [locale])

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Articles et guides sur le trading
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass rounded-lg p-12 text-center">
          <p className="text-muted-foreground">Aucun article publié pour le moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="glass rounded-lg overflow-hidden hover:scale-105 transition-all cursor-pointer group"
            >
              {post.cover_image && (
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  {post.category && (
                    <span className="px-2 py-1 bg-primary/20 rounded text-xs">
                      {post.category}
                    </span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {post.tags.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    {post.author && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                    )}
                    {post.published_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.published_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}








