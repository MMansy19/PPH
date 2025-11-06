import { useState, useEffect, useCallback, useRef } from 'react'
import { usernameService } from '@/lib/username-service'
import type { UsernameAvailability, UsernameValidation } from '@/types/team'

/**
 * Hook for username management
 * 
 * Provides:
 * - Real-time username validation
 * - Debounced availability checking
 * - Username update functionality
 */
export function useUsername(userId?: string, currentUsername?: string) {
  const [validation, setValidation] = useState<UsernameValidation>({ valid: true })
  const [availability, setAvailability] = useState<UsernameAvailability | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Validates username format (instant, no API call)
   */
  const validateUsername = useCallback((username: string): UsernameValidation => {
    const result = usernameService.validateUsername(username)
    setValidation(result)
    return result
  }, [])

  /**
   * Checks username availability (debounced, API call)
   */
  const checkAvailability = useCallback(async (username: string, immediate: boolean = false) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    // Reset availability state
    setAvailability(null)
    
    // Validate format first
    const validation = usernameService.validateUsername(username)
    setValidation(validation)
    
    if (!validation.valid) {
      setIsCheckingAvailability(false)
      return
    }

    // Skip check if it's the user's current username
    if (currentUsername && username.toLowerCase() === currentUsername.toLowerCase()) {
      setAvailability({ available: true, username })
      setIsCheckingAvailability(false)
      return
    }

    const checkNow = async () => {
      setIsCheckingAvailability(true)
      
      try {
        const response = await usernameService.checkAvailability(username, userId)
        if (response.data) {
          setAvailability(response.data)
        }
      } catch (error) {
        console.error('Error checking username availability:', error)
      } finally {
        setIsCheckingAvailability(false)
      }
    }

    if (immediate) {
      await checkNow()
    } else {
      // Debounce for 500ms
      setIsCheckingAvailability(true)
      debounceTimerRef.current = setTimeout(checkNow, 500)
    }
  }, [userId, currentUsername])

  /**
   * Updates username
   */
  const updateUsername = useCallback(async (newUsername: string) => {
    if (!userId) {
      setUpdateError('User ID is required')
      return false
    }

    setIsUpdating(true)
    setUpdateError(null)
    setUpdateSuccess(false)

    try {
      const response = await usernameService.updateUsername(userId, { new_username: newUsername })
      
      if (response.error) {
        setUpdateError(response.error.message)
        return false
      }

      setUpdateSuccess(true)
      return true
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update username')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [userId])

  /**
   * Resets all state
   */
  const reset = useCallback(() => {
    setValidation({ valid: true })
    setAvailability(null)
    setIsCheckingAvailability(false)
    setIsUpdating(false)
    setUpdateError(null)
    setUpdateSuccess(false)
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    // Validation state
    validation,
    isValid: validation.valid,
    validationError: validation.error,

    // Availability state
    availability,
    isAvailable: availability?.available ?? null,
    availabilityError: availability?.error,
    suggestion: availability?.suggestion,
    isCheckingAvailability,

    // Update state
    isUpdating,
    updateError,
    updateSuccess,

    // Methods
    validateUsername,
    checkAvailability,
    updateUsername,
    reset
  }
}
