'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import FinancialDashboard from '@/components/financial/FinancialDashboard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function FinancialPage() {
  const { user, loading } = useRequireAuth('/auth/login?redirect=/financial')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return <FinancialDashboard />
}