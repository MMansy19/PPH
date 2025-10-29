import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Management | PPH',
  description: 'Economic Input/Output Management System - Track income, expenses, and financial performance',
}

export default function FinancialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}