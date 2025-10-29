'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { OTPVerificationForm } from '@/components/auth/OTPVerificationForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'signup' | 'email_change' | 'sms' | 'phone_change' | 'recovery'>('signup')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const typeParam = searchParams.get('type')

    if (!emailParam) {
      router.push('/auth/login')
      return
    }

    setEmail(emailParam)
    if (typeParam && ['signup', 'email_change', 'sms', 'phone_change', 'recovery'].includes(typeParam)) {
      setType(typeParam as any)
    }
  }, [searchParams, router])

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const getTitle = () => {
    switch (type) {
      case 'recovery': return 'Verify Recovery Code'
      case 'email_change': return 'Verify New Email'
      default: return 'Verify Your Email'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'recovery': return 'Enter the recovery code sent to your email'
      case 'email_change': return 'Enter the code sent to your new email address'
      default: return "We've sent a verification code to your email"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PFHub</h1>
          <p className="text-gray-600">Portfolio Financial Hub</p>
        </div>
        <OTPVerificationForm 
          email={email}
          type={['sms', 'phone_change'].includes(type) ? 'signup' : type as 'signup' | 'email_change' | 'recovery'}
          title={getTitle()}
          description={getDescription()}
          onSuccess={() => router.push('/')}
          onBack={() => router.back()}
        />
      </div>
    </div>
  )
}