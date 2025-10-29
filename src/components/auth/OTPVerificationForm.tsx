'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OTPVerificationFormProps {
  email: string
  type: 'signup' | 'email_change' | 'recovery'
  onSuccess?: () => void
  onBack?: () => void
  title?: string
  description?: string
}

export function OTPVerificationForm({ 
  email, 
  type, 
  onSuccess, 
  onBack,
  title = "Verify Your Email",
  description = "We've sent a verification code to your email"
}: OTPVerificationFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [success, setSuccess] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyOtp, resendOtp } = useAuth()

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setAuthError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (value && newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    
    setOtp(newOtp)
    
    if (pastedData.length === 6) {
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join('')
    
    if (code.length !== 6) {
      setAuthError('Please enter the complete 6-digit code')
      return
    }

    setAuthError('')
    setIsSubmitting(true)
    
    try {
      const { error } = await verifyOtp(email, code, type)
      
      if (error) {
        if (error.message.includes('Token has expired')) {
          setAuthError('The verification code has expired. Please request a new one.')
        } else if (error.message.includes('Invalid token')) {
          setAuthError('Invalid verification code. Please check and try again.')
        } else {
          setAuthError(error.message || 'Verification failed. Please try again.')
        }
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    setAuthError('')
    
    try {
      const { error } = await resendOtp(email, type as 'signup' | 'email_change')
      
      if (error) {
        setAuthError(error.message || 'Failed to resend code. Please try again.')
      } else {
        setResendCooldown(60) // 60 second cooldown
        setOtp(['', '', '', '', '', '']) // Clear current OTP
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              You can now access all features of Portfolio Financial Hub.
            </p>
          </div>
          <Link href="/">
            <Button className="w-full">
              Continue to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
        <p className="text-sm text-gray-600 mt-2">
          Code sent to: <strong>{email}</strong>
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {authError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {authError}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter 6-digit verification code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isSubmitting}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={() => handleSubmit()}
            className="w-full" 
            disabled={isSubmitting || otp.some(digit => !digit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isResending}
              className="text-blue-600 hover:text-blue-800"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              )}
            </Button>
          </div>

          {onBack && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}