'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

const routeLabels: Record<string, string> = {
  app: 'Dashboard',
  financial: 'Financial',
  transactions: 'Transactions',
  departments: 'Departments',
  reports: 'Reports',
  portfolio: 'Portfolio',
  analytics: 'Analytics',
  settings: 'Settings',
  board: 'Board View',
  calendar: 'Calendar',
  list: 'List View',
  map: 'Process Map'
}

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length <= 1) return null

  const breadcrumbItems: BreadcrumbItem[] = []

  // Build breadcrumb items
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    // Don't add link for the last item (current page)
    breadcrumbItems.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath
    })
  })

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}>
      <Link
        href="/"
        className="flex items-center hover:text-gray-700 transition-colors touch-target p-1"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 transition-colors touch-target px-1 pt-3"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium px-1">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}