'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { getBlogPost, BlogPostDB } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function BlogPostPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPostDB | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getBlogPost(slug)
        setPost(data)
      } catch (error) {
        console.error('Error loading blog post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      loadPost()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement de l&apos;article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="glass rounded-lg p-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            L&apos;article que vous cherchez n&apos;existe pas ou n&apos;est pas encore publié.
          </p>
          <Link href={`/${locale}/blog`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="container mx-auto px-4 py-20 max-w-4xl">
      {/* Bouton retour */}
      <Link href={`/${locale}/blog`} className="inline-block mb-8">
        <Button variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au blog</span>
        </Button>
      </Link>

      {/* Image de couverture */}
      {post.cover_image && (
        <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-8">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* En-tête */}
      <header className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          {post.category && (
            <span className="px-3 py-1 bg-primary/20 rounded-md text-sm">
              {post.category}
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-background border border-border rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          {post.author && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          )}
          {post.published_at && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          )}
        </div>
      </header>

      {/* Contenu */}
      <div
        className="prose prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{
          __html: post.content
            .split('\n')
            .map((paragraph) => {
              if (paragraph.trim() === '') return '<br />'
              if (paragraph.startsWith('# ')) {
                return `<h1 class="text-3xl font-bold mt-8 mb-4">${paragraph.slice(2)}</h1>`
              }
              if (paragraph.startsWith('## ')) {
                return `<h2 class="text-2xl font-bold mt-6 mb-3">${paragraph.slice(3)}</h2>`
              }
              if (paragraph.startsWith('### ')) {
                return `<h3 class="text-xl font-bold mt-4 mb-2">${paragraph.slice(4)}</h3>`
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return `<li class="ml-4">${paragraph.slice(2)}</li>`
              }
              return `<p class="mb-4 leading-relaxed">${paragraph}</p>`
            })
            .join(''),
        }}
      />

      {/* Footer */}
      <div className="border-t border-border pt-8 mt-12">
        <Link href={`/${locale}/blog`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au blog
          </Button>
        </Link>
      </div>
    </article>
  )
}

