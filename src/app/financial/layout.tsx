import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Management | PPH',
  description: 'Economic Input/Output Management System - Track income, expenses, and financial performance with comprehensive reporting and analytics',
  openGraph: {
    title: 'PPH Financial Management',
    description: 'Complete financial tracking and reporting system',
    url: 'https://pph.vercel.app/app/financial',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function FinancialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  )
}