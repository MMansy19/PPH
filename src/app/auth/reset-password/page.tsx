'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tokens, setTokens] = useState<{ access_token?: string; refresh_token?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error || (!accessToken && !refreshToken)) {
      // Invalid or expired link, redirect to forgot password
      router.push('/auth/forgot-password')
      return
    }

    setTokens({ access_token: accessToken || undefined, refresh_token: refreshToken || undefined })
    setLoading(false)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ResetPasswordForm 
      accessToken={tokens.access_token}
      refreshToken={tokens.refresh_token}
    />
  )
}