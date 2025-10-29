'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ForgotPasswordPage() {
  const { loading } = useRedirectIfAuthenticated()

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <ForgotPasswordForm />
}