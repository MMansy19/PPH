'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function RegisterPage() {
  const { loading } = useRedirectIfAuthenticated()

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <RegisterForm />
}