'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function RegisterPage() {
  const { loading } = useRedirectIfAuthenticated()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PPH</h1>
          <p className="text-gray-600">Personal Process Hub</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}