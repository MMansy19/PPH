import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PFHub - Portfolio Financial Hub | Portfolio Management & Financial Tracking',
    template: '%s | PFHub - Portfolio Financial Hub'
  },
  description: 'Portfolio Financial Hub (PFHub) - Visualize and manage your portfolio with interactive bubble charts, Kanban boards, process maps, and data tables. Track finances, manage budgets, expenses, and income with comprehensive financial analytics. Export to PNG, PDF, and CSV.',
  keywords: [
    'portfolio management',
    'financial tracking',
    'task management',
    'bubble chart',
    'kanban board',
    'process map',
    'financial management',
    'expense tracking',
    'budget management',
    'income tracking',
    'project visualization',
    'drag and drop',
    'data visualization',
    'portfolio prioritization',
    'risk assessment',
    'value vs risk',
    'Big Bets',
    'product management',
    'project planning',
    'task board',
    'workflow management',
    'financial analytics',
    'financial dashboard',
    'react flow',
    'next.js app'
  ],
  authors: [{ name: 'MMansy19' }],
  creator: 'MMansy19',
  publisher: 'PFHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pph.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PFHub - Portfolio Financial Hub | Portfolio Management & Financial Tracking',
    description: 'Visualize and manage your portfolio with interactive bubble charts, Kanban boards, process maps, and comprehensive financial tracking tools. Export to PNG, PDF, CSV.',
    url: 'https://pph.vercel.app',
    siteName: 'Portfolio Financial Hub',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'PFHub - Portfolio Financial Hub Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PFHub - Portfolio Financial Hub',
    description: 'Portfolio management with bubble charts, Kanban boards, process maps & financial tracking',
    images: ['/logo.png'],
    creator: '@MMansy19', // Update with your Twitter handle
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
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.png', sizes: '192x192' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code', // Add after Google Search Console setup
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
}

export default function RootLayout({  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1 pt-14 sm:pt-16 relative">
              <div className="min-h-full">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
