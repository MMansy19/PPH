'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

/**
 * Hook to protect routes that require authentication
 */
export function useRequireAuth(redirectTo = '/auth/login') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

/**
 * Hook to redirect authenticated users (for login/register pages)
 */
export function useRedirectIfAuthenticated(redirectTo = '/') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

/**
 * Hook for form validation states
 */
export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    
    if (!isValid) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
    
    return isValid
  }

  const validatePassword = (password: string, minLength = 6): boolean => {
    const isValid = password.length >= minLength
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev, 
        password: `Password must be at least ${minLength} characters long` 
      }))
    } else {
      setErrors(prev => ({ ...prev, password: '' }))
    }
    
    return isValid
  }

  const validatePasswordConfirm = (password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: 'Passwords do not match' 
      }))
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
    
    return isValid
  }

  const validateRequired = (value: string, fieldName: string): boolean => {
    const isValid = value.trim().length > 0
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev, 
        [fieldName]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` 
      }))
    } else {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
    
    return isValid
  }

  const clearErrors = () => setErrors({})
  
  const clearError = (fieldName: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
  }

  return {
    errors,
    isSubmitting,
    setIsSubmitting,
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateRequired,
    clearErrors,
    clearError,
    setErrors
  }
}