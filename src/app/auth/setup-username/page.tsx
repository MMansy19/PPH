'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usernameService } from '@/lib/username-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/Toast'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function SetupUsernamePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  
  const [username, setUsername] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validation, setValidation] = useState<{
    valid: boolean
    error?: string
    available?: boolean
  } | null>(null)

  // Check if user already has username
  useEffect(() => {
    const checkExistingUsername = async () => {
      if (!user?.id) return

      try {
        const { data: profile } = await usernameService.getUserProfile(user.id)
        if (profile?.username) {
          // User already has username, redirect to app
          router.push('/app')
        }
      } catch (error) {
        console.error('Error checking username:', error)
      }
    }

    checkExistingUsername()
  }, [user, router])

  // Validate and check availability
  useEffect(() => {
    if (!username) {
      setValidation(null)
      return
    }

    // Validate format
    const formatValidation = usernameService.validateUsername(username)
    if (!formatValidation.valid) {
      setValidation({
        valid: false,
        error: formatValidation.error
      })
      return
    }

    // Check availability with debounce
    const timer = setTimeout(async () => {
      setIsChecking(true)
      try {
        const result = await usernameService.checkAvailability(username, user?.id)
        setValidation({
          valid: result.data?.available || false,
          error: result.data?.available ? undefined : result.data?.error,
          available: result.data?.available
        })
      } catch (error) {
        setValidation({
          valid: false,
          error: 'Failed to check availability'
        })
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validation?.valid || !user?.id) return

    setIsSubmitting(true)
    try {
      const result = await usernameService.updateUsername(user.id, {
        new_username: username
      })

      if (result.error) {
        showError(result.error.message || 'Failed to set username')
        return
      }

      success('Username set successfully!')
      
      // Redirect to app
      setTimeout(() => {
        router.push('/app')
      }, 1000)
    } catch (error) {
      showError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Username</h1>
            <p className="text-muted-foreground">
              This will be your unique identifier on the platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="Enter your username"
                  disabled={isSubmitting}
                  className="pr-10"
                  autoComplete="off"
                  autoFocus
                />
                {isChecking && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                )}
                {!isChecking && validation?.valid && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
                {!isChecking && validation && !validation.valid && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
                )}
              </div>

              {/* Validation Messages */}
              {validation && !validation.valid && validation.error && (
                <div className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{validation.error}</span>
                </div>
              )}
              {validation?.valid && (
                <div className="flex items-start gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Username is available!</span>
                </div>
              )}

              {/* Guidelines */}
              <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <p className="font-medium">Username requirements:</p>
                <ul className="list-disc list-inside space-y-0.5 pl-2">
                  <li>3-30 characters long</li>
                  <li>Only letters, numbers, hyphens, and underscores</li>
                  <li>Must start and end with a letter or number</li>
                  <li>Lowercase only</li>
                </ul>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!validation?.valid || isSubmitting || isChecking}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          You can change your username later in settings
        </p>
      </div>
    </div>
  )
}
