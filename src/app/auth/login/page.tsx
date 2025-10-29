'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function LoginPage() {
  const { loading } = useRedirectIfAuthenticated()

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <LoginForm />
}