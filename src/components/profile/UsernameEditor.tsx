'use client'

import { useState, useEffect } from 'react'
import { useUsername } from '@/hooks/useUsername'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Check, X, AlertCircle, Loader2 } from 'lucide-react'

interface UsernameEditorProps {
  userId: string
  currentUsername?: string
  onUpdate?: (newUsername: string) => void
  onCancel?: () => void
}

/**
 * UsernameEditor Component
 * 
 * Provides a complete username editing experience with:
 * - Real-time format validation
 * - Debounced availability checking
 * - Visual feedback (loading, success, error states)
 * - Suggestions when username is taken
 */
export function UsernameEditor({ 
  userId, 
  currentUsername = '', 
  onUpdate,
  onCancel 
}: UsernameEditorProps) {
  const [inputValue, setInputValue] = useState(currentUsername)
  const [hasChanges, setHasChanges] = useState(false)

  const {
    validation,
    isValid,
    validationError,
    availability,
    isAvailable,
    availabilityError,
    suggestion,
    isCheckingAvailability,
    isUpdating,
    updateError,
    updateSuccess,
    validateUsername,
    checkAvailability,
    updateUsername,
    reset
  } = useUsername(userId, currentUsername)

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value)
    setHasChanges(value !== currentUsername)

    // Validate and check availability
    if (value.trim()) {
      validateUsername(value)
      checkAvailability(value)
    }
  }

  // Handle save
  const handleSave = async () => {
    if (!hasChanges || !isValid || isAvailable === false) {
      return
    }

    const success = await updateUsername(inputValue)
    if (success && onUpdate) {
      onUpdate(inputValue)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setInputValue(currentUsername)
    setHasChanges(false)
    reset()
    if (onCancel) {
      onCancel()
    }
  }

  // Handle suggestion click
  const handleUseSuggestion = () => {
    if (suggestion) {
      setInputValue(suggestion)
      handleInputChange(suggestion)
    }
  }

  // Auto-reset success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        reset()
        setHasChanges(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [updateSuccess, reset])

  // Determine input state
  const getInputState = () => {
    if (!inputValue.trim()) return 'default'
    if (!isValid) return 'error'
    if (isCheckingAvailability) return 'loading'
    if (isAvailable === false) return 'error'
    if (isAvailable === true && hasChanges) return 'success'
    return 'default'
  }

  const inputState = getInputState()

  // Determine if save button should be enabled
  const canSave = hasChanges && isValid && isAvailable === true && !isCheckingAvailability && !isUpdating

  return (
    <div className="space-y-4">
      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="username">
          Username
          <span className="ml-1 text-xs text-muted-foreground">
            (3-30 characters, letters, numbers, hyphens, underscores)
          </span>
        </Label>
        
        <div className="relative">
          <Input
            id="username"
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter username"
            disabled={isUpdating}
            className={`pr-10 ${
              inputState === 'error' ? 'border-destructive focus-visible:ring-destructive' :
              inputState === 'success' ? 'border-green-500 focus-visible:ring-green-500' :
              ''
            }`}
            autoComplete="off"
          />

          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCheckingAvailability && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!isCheckingAvailability && inputState === 'success' && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            {!isCheckingAvailability && inputState === 'error' && (
              <X className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Availability Error */}
        {!validationError && availabilityError && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{availabilityError}</span>
          </div>
        )}

        {/* Success Message */}
        {isAvailable && hasChanges && !validationError && !availabilityError && (
          <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-500">
            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Username is available!</span>
          </div>
        )}

        {/* Update Success */}
        {updateSuccess && (
          <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-500">
            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Username updated successfully!</span>
          </div>
        )}

        {/* Update Error */}
        {updateError && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{updateError}</span>
          </div>
        )}

        {/* Suggestion */}
        {suggestion && isAvailable === false && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Try:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseSuggestion}
              disabled={isUpdating}
            >
              {suggestion}
            </Button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSave}
          disabled={!canSave}
          size="sm"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Username'
          )}
        </Button>

        {hasChanges && (
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            disabled={isUpdating}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Current Username Display */}
      {currentUsername && !hasChanges && (
        <div className="text-sm text-muted-foreground">
          Current username: <span className="font-medium text-foreground">{currentUsername}</span>
        </div>
      )}
    </div>
  )
}
