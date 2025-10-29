'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import TransactionList from '@/components/financial/TransactionList'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function TransactionsPage() {
  const { user, loading } = useRequireAuth('/auth/login?redirect=/app/financial/transactions')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return <TransactionList />
}