'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home, FolderOpen, Users, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
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
  map: 'Process Map',
  projects: 'Projects',
  teams: 'Teams',
  tasks: 'Tasks'
}

const routeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  projects: FolderOpen,
  teams: Users,
  tasks: CheckSquare
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // If custom items are provided, use them; otherwise generate from pathname
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length <= 1) return []

    const generatedItems: BreadcrumbItem[] = []
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      const icon = routeIcons[segment]
      
      generatedItems.push({
        label,
        href: index === segments.length - 1 ? undefined : currentPath,
        icon,
        current: index === segments.length - 1
      })
    })
    
    return generatedItems
  })()

  if (breadcrumbItems.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <Link
        href="/"
        className="flex items-center hover:text-gray-700 transition-colors touch-target p-1"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        const Icon = item.icon
        
        return (
          <div key={index} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4" />
            
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 hover:text-foreground transition-colors touch-target px-1 py-1"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="truncate max-w-[200px]">{item.label}</span>
              </Link>
            ) : (
              <div className={cn(
                "flex items-center space-x-1 px-1",
                isLast ? "text-foreground font-medium" : ""
              )}>
                {Icon && <Icon className="h-4 w-4" />}
                <span className="truncate max-w-[200px]">{item.label}</span>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}