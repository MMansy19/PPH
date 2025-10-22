'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ForgotPasswordPage() {
  const { loading } = useRedirectIfAuthenticated()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PPH</h1>
          <p className="text-gray-600">Personal Process Hub</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}