// Composant désactivé - Les balises hreflang sont gérées via les métadonnées Next.js
// dans lib/seo.ts via alternates.languages dans generateMetadata()
// Cela évite les erreurs de manipulation DOM côté client

export function HreflangTags() {
  // Les balises hreflang sont automatiquement générées par Next.js
  // via les métadonnées alternates.languages
  return null
}
