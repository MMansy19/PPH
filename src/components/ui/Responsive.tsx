'use client'
import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveShowProps {
  above?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  below?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  children: React.ReactNode
}

export function ResponsiveShow({ above, below, children }: ResponsiveShowProps) {
  const responsive = useResponsive()
  
  // Check above breakpoint
  if (above) {
    const shouldShow = 
      (above === 'xs' && responsive.isXs) ||
      (above === 'sm' && responsive.isSm) ||
      (above === 'md' && responsive.isMd) ||
      (above === 'lg' && responsive.isLg) ||
      (above === 'xl' && responsive.isXl) ||
      (above === '2xl' && responsive.is2Xl) ||
      (above === '3xl' && responsive.is3Xl)
    
    if (!shouldShow) return null
  }
  
  // Check below breakpoint
  if (below) {
    const shouldHide = 
      (below === 'xs' && responsive.isXs) ||
      (below === 'sm' && responsive.isSm) ||
      (below === 'md' && responsive.isMd) ||
      (below === 'lg' && responsive.isLg) ||
      (below === 'xl' && responsive.isXl) ||
      (below === '2xl' && responsive.is2Xl) ||
      (below === '3xl' && responsive.is3Xl)
    
    if (shouldHide) return null
  }
  
  return <>{children}</>
}

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  padding?: boolean
}

export function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = '2xl',
  padding = true 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full'
  }
  
  const paddingClass = padding ? 'container-responsive' : 'mx-auto'
  
  return (
    <div className={`${paddingClass} ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className = ''
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  }
  
  const getGridCols = () => {
    const colClasses = []
    
    if (cols.default) colClasses.push(`grid-cols-${cols.default}`)
    if (cols.xs) colClasses.push(`xs:grid-cols-${cols.xs}`)
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`)
    if (cols['2xl']) colClasses.push(`2xl:grid-cols-${cols['2xl']}`)
    
    return colClasses.join(' ')
  }
  
  return (
    <div className={`grid ${getGridCols()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveStackProps {
  children: React.ReactNode
  direction?: {
    default?: 'row' | 'col'
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
  }
  gap?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  className?: string
}

export function ResponsiveStack({
  children,
  direction = { default: 'col', sm: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start',
  className = ''
}: ResponsiveStackProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }
  
  const getFlexDirection = () => {
    const dirClasses = []
    
    if (direction.default) {
      dirClasses.push(direction.default === 'row' ? 'flex-row' : 'flex-col')
    }
    if (direction.sm) {
      dirClasses.push(direction.sm === 'row' ? 'sm:flex-row' : 'sm:flex-col')
    }
    if (direction.md) {
      dirClasses.push(direction.md === 'row' ? 'md:flex-row' : 'md:flex-col')
    }
    if (direction.lg) {
      dirClasses.push(direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col')
    }
    
    return dirClasses.join(' ')
  }
  
  return (
    <div className={`
      flex 
      ${getFlexDirection()} 
      ${gapClasses[gap]} 
      ${alignClasses[align]} 
      ${justifyClasses[justify]} 
      ${className}
    `}>
      {children}
    </div>
  )
}