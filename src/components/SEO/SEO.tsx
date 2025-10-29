'use client'
import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
  noindex?: boolean
}

export function SEO({
  title = 'PFH - Portfolio Financial Hub',
  description = 'Visualize and manage your portfolio with interactive bubble charts, Kanban boards, and process maps.',
  keywords = ['portfolio management', 'task management', 'bubble chart'],
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes('PFH') ? title : `${title} | PFH`
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* No index */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="theme-color" content="#2563eb" />
    </Head>
  )
}
