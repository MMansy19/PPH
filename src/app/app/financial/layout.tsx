import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Financial Hub | PFH',
  description: 'Portfolio Financial Hub (PFH) - Economic Input/Output Management System. Track income, expenses, budgets, and financial performance with comprehensive reporting and analytics. Manage departments, categories, and transactions efficiently.',
  keywords: [
    'portfolio financial hub',
    'PFH',
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
    title: 'Portfolio Financial Hub - PFH',
    description: 'Track income, expenses, and budgets with comprehensive reporting and analytics',
    url: 'https://pph.vercel.app/app/financial',
    siteName: 'Portfolio Financial Hub',
    images: [
      {
        url: '/financial-og.png',
        width: 1200,
        height: 630,
        alt: 'PFH - Portfolio Financial Hub Dashboard - Track Income, Expenses & Budgets',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Financial Hub - PFH',
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
    ],
  },
  alternates: {
    canonical: '/app/financial',
  },
}

export default function FinancialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Portfolio Financial Hub (PFH)',
    applicationCategory: 'BusinessApplication',
    description: 'Economic Input/Output Management System for tracking income, expenses, and financial performance',
    operatingSystem: 'Web',
    url: 'https://pph.vercel.app/app/financial',
    image: 'https://pph.vercel.app/financial-og.png',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="space-y-6">
        {children}
      </div>
    </>
  )
}