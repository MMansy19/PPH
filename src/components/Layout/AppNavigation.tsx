'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  PieChart, 
  DollarSign, 
  Settings, 
  BarChart3,
  Calendar,
  List,
  Map
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/app',
    icon: LayoutDashboard,
    description: 'Portfolio overview and main dashboard'
  },
  {
    name: 'Portfolio Chart',
    href: '/app/portfolio',
    icon: PieChart,
    description: 'Interactive bubble chart visualization'
  },
  {
    name: 'Financial',
    href: '/app/financial',
    icon: DollarSign,
    description: 'Financial management and tracking'
  },
  {
    name: 'Analytics',
    href: '/app/analytics',
    icon: BarChart3,
    description: 'Advanced reports and analytics'
  },
]

const viewModes = [
  {
    name: 'Board View',
    href: '/app/board',
    icon: LayoutDashboard,
    description: 'Kanban board layout'
  },
  {
    name: 'Calendar',
    href: '/app/calendar',
    icon: Calendar,
    description: 'Calendar view of tasks'
  },
  {
    name: 'List View',
    href: '/app/list',
    icon: List,
    description: 'Simple list format'
  },
  {
    name: 'Process Map',
    href: '/app/map',
    icon: Map,
    description: 'Visual workflow mapping'
  },
]

interface AppNavigationProps {
  className?: string
}

export function AppNavigation({ className }: AppNavigationProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700', className)}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </h3>
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-target',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                      title={item.description}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* View Modes */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Views
            </h3>
            <ul className="space-y-1">
              {viewModes.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-target',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                      title={item.description}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link
              href="/app/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-target',
                pathname === '/app/settings'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

interface MobileAppNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileAppNavigation({ isOpen, onClose }: MobileAppNavigationProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Main
              </h3>
              <ul className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  const Icon = item.icon
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-target',
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* View Modes */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Views
              </h3>
              <ul className="space-y-1">
                {viewModes.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-target',
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}