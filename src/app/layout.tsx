import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PPH - Personal Process Hub | Portfolio Management & Task Visualization',
    template: '%s | PPH - Personal Process Hub'
  },
  description: 'Visualize and manage your portfolio with interactive bubble charts, Kanban boards, process maps, and data tables. Perfect for product managers, teams, and students. Export to PNG, PDF, and CSV.',
  keywords: [
    'portfolio management',
    'task management',
    'bubble chart',
    'kanban board',
    'process map',
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
    'react flow',
    'next.js app'
  ],
  authors: [{ name: 'MMansy19' }],
  creator: 'MMansy19',
  publisher: 'PPH',
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
    title: 'PPH - Personal Process Hub | Portfolio Management & Task Visualization',
    description: 'Visualize and manage your portfolio with interactive bubble charts, Kanban boards, and process maps. Export to PNG, PDF, CSV.',
    url: 'https://pph.vercel.app',
    siteName: 'Personal Process Hub',
    images: [
      {
        url: '/og-image.png', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'PPH Portfolio Bubble Chart Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPH - Personal Process Hub',
    description: 'Portfolio management with bubble charts, Kanban boards & process maps',
    images: ['/og-image.png'],
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
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code', // Add after Google Search Console setup
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
