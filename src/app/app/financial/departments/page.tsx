'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import DepartmentManagement from '@/components/financial/DepartmentManagement'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function DepartmentsPage() {
  const { user, loading } = useRequireAuth('/auth/login?redirect=/app/financial/departments')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return <DepartmentManagement />
}