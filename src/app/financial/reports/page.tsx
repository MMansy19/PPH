'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import ReportsView from '@/components/financial/ReportsView'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ReportsPage() {
  const { user, loading } = useRequireAuth('/auth/login?redirect=/financial/reports')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return <ReportsView />
}