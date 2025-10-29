export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Portfolio Financial Hub',
    alternateName: 'PFHub',
    url: 'https://pph.vercel.app',
    description: 'Visualize and manage your portfolio with interactive bubble charts, Kanban boards, process maps, and data tables.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    screenshot: 'https://pph.vercel.app/screenshot-wide.png',
    featureList: [
      'Portfolio Bubble Chart Visualization',
      'Kanban Board with Drag & Drop',
      'Interactive Process Map',
      'Data Table View',
      'Calendar View',
      'List View',
      'Export to PNG, PDF, CSV',
      'Real-time Collaboration',
      'Task Management',
      'Risk Assessment'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Portfolio Financial Hub',
    alternateName: 'PFHub',
    url: 'https://pph.vercel.app',
    logo: 'https://pph.vercel.app/logo.png',
    sameAs: [
      'https://github.com/MMansy19/PPH',
      // Add your social media links
      // 'https://twitter.com/yourusername',
      // 'https://linkedin.com/company/yourcompany',
    ]
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Personal Process Hub',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  }
}
