'use client'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text = 'Loading your portfolio...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-8 sm:py-12 lg:py-16', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm sm:text-base text-muted-foreground text-center">{text}</p>
      )}
    </div>
  )
}

interface LoadingScreenProps {
  text?: string
}

export function LoadingScreen({ text = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background safe-area-top safe-area-bottom">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
}

export function LoadingOverlay({ isLoading, children, text }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-safari flex items-center justify-center z-50">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  )
}
