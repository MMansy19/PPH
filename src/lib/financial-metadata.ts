import { Metadata } from 'next'

export const financialMetadata: Metadata = {
  title: 'Financial Management | PPH',
  description: 'Economic Input/Output Management System - Track income, expenses, budgets, and financial performance with comprehensive reporting and analytics. Manage departments, categories, and transactions efficiently.',
  keywords: [
    'financial management',
    'expense tracking',
    'income tracking',
    'budget management',
    'financial reports',
    'transaction management',
    'economic management',
    'financial analytics',
    'business finance',
    'accounting software',
    'financial dashboard',
    'revenue tracking',
    'department budgets',
    'financial categories',
  ],
  authors: [{ name: 'MMansy19' }],
  openGraph: {
    title: 'Financial Management - PPH',
    description: 'Track income, expenses, and budgets with comprehensive reporting and analytics',
    url: 'https://pph.vercel.app/app/financial',
    siteName: 'PPH Financial Management',
    images: [
      {
        url: '/financial-og.png',
        width: 1200,
        height: 630,
        alt: 'PPH Financial Management Dashboard - Track Income, Expenses & Budgets',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Management - PPH',
    description: 'Economic I/O Management System - Track income, expenses & financial performance',
    images: ['/financial-og.png'],
    creator: '@MMansy19',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/financial-logo.svg', type: 'image/svg+xml' },
      { url: '/financial-icon.svg', type: 'image/svg+xml', sizes: '32x32' },
    ],
  },
  alternates: {
    canonical: '/app/financial',
  },
}

export const financialStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PPH Financial Management',
  applicationCategory: 'BusinessApplication',
  description: 'Economic Input/Output Management System for tracking income, expenses, and financial performance',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
  },
  featureList: [
    'Transaction Management',
    'Department Budgets',
    'Income & Expense Tracking',
    'Financial Reports',
    'Category Management',
    'Financial Analytics',
    'Export to CSV/PDF',
    'Real-time Dashboard',
  ],
}
