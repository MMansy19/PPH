'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFormValidation } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')

  const { signIn } = useAuth()
  const { 
    errors, 
    isSubmitting, 
    setIsSubmitting, 
    validateEmail, 
    validateRequired,
    clearErrors 
  } = useFormValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    clearErrors()

    // Validation
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validateRequired(password, 'password')

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        console.error('Login error details:', error)
        
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('Invalid email or password. Please check your credentials and try again. If you haven\'t registered yet, please sign up first.')
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('Please check your email and click the confirmation link before signing in.')
        } else if (error.message.includes('User not found')) {
          setAuthError('No account found with this email. Please sign up first.')
        } else {
          setAuthError(`${error.message || 'An error occurred during sign in.'} - Please try signing up first if you don't have an account.`)
        }
      }
    } catch (error) {
      console.error('Unexpected login error:', error)
      setAuthError('An unexpected error occurred. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-2 px-4 sm:px-6 pt-6 sm:pt-8">
        <CardTitle className="text-xl sm:text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Sign in to your Personal Process Hub account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {authError && (
            <div className="p-3 sm:p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {authError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium block">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`touch-target ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              disabled={isSubmitting}
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium block">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`touch-target pr-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent touch-target"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link 
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800 underline touch-target"
            >
              Forgot your password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full touch-target" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center text-sm text-gray-600 pt-2">
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-blue-600 hover:text-blue-800 underline font-medium touch-target"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}