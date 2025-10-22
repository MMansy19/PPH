'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFormValidation } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [success, setSuccess] = useState(false)

  const { resetPassword } = useAuth()
  const { 
    errors, 
    isSubmitting, 
    setIsSubmitting, 
    validateEmail,
    clearErrors 
  } = useFormValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    clearErrors()

    // Validation
    const isEmailValid = validateEmail(email)

    if (!isEmailValid) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        if (error.message.includes('User not found')) {
          setAuthError('No account found with this email address.')
        } else {
          setAuthError(error.message || 'An error occurred while sending the reset email.')
        }
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">Check Your Email</CardTitle>
          <CardDescription>
            Reset link sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link in your email to create a new password.
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>The link will expire in 24 hours for security.</p>
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={() => setSuccess(false)}
              >
                try again
              </button>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
        <CardDescription>
          No worries! Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {authError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              disabled={isSubmitting}
              autoComplete="email"
              autoFocus
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Reset Link
              </>
            )}
          </Button>

          <div className="text-center">
            <Link 
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 underline"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}