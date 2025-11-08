'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTasksStore } from '@/store/useTasksStore'
import { ProjectSelectorCompact } from '@/components/projects/ProjectSelectorCompact'
import { useSelectedProject } from '@/hooks/useSelectedProject'
import type { ViewMode } from '@/types'
import { 
  LayoutDashboard, 
  PieChart, 
  DollarSign, 
  Settings, 
  BarChart3,
  Calendar,
  List,
  Map,
  ChevronLeft,
  ChevronRight,
  Eye,
  FolderOpen,
  Users
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/app',
    icon: LayoutDashboard,
    description: 'Portfolio overview and main dashboard'
  },
  {
    name: 'Projects',
    href: '/app/projects',
    icon: FolderOpen,
    description: 'Manage projects and organize teams'
  },
  {
    name: 'Teams',
    href: '/app/teams',
    icon: Users,
    description: 'Team collaboration and management'
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

const viewModes: Array<{
  name: string
  mode: ViewMode
  icon: typeof LayoutDashboard
  description: string
}> = [
  {
    name: 'Board View',
    mode: 'board',
    icon: LayoutDashboard,
    description: 'Kanban board layout'
  },
  {
    name: 'Calendar',
    mode: 'calendar',
    icon: Calendar,
    description: 'Calendar view of tasks'
  },
  {
    name: 'List View',
    mode: 'list',
    icon: List,
    description: 'Simple list format'
  },
  {
    name: 'Process Map',
    mode: 'map',
    icon: Map,
    description: 'Visual workflow mapping'
  },
  {
    name: 'Table View',
    mode: 'table',
    icon: LayoutDashboard,
    description: 'Data table view'
  },
]

interface AppNavigationProps {
  className?: string
}

export function AppNavigation({ className }: AppNavigationProps) {
  const pathname = usePathname()
  const { viewMode, setViewMode, currentWorkspaceId } = useTasksStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [viewsExpanded, setViewsExpanded] = useState(true)
  const { selectedProject, setSelectedProject } = useSelectedProject()

  const isOnDashboard = pathname === '/app'

  return (
    <aside className={cn(
      'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out relative',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      <div className="h-full px-3 py-8 overflow-y-auto w-full">
        <div className="space-y-6">
          {/* Project Selector */}
          {!isCollapsed && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="mb-3 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Project
              </h3>
              <div className="px-3">
                {currentWorkspaceId && (
                  <ProjectSelectorCompact 
                    workspaceId={currentWorkspaceId}
                    selectedProjectId={selectedProject?.id}
                    onProjectSelect={(project) => {
                      setSelectedProject(project)
                      console.log('Selected project:', project)
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div>
            {!isCollapsed && (
              <h3 className="mb-3 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Navigation
              </h3>
            )}
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/app')
                const Icon = item.icon
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 touch-target relative overflow-hidden',
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:shadow-md'
                      )}
                      title={isCollapsed ? item.name : item.description}
                    >
                      <Icon className={cn(
                        "flex-shrink-0 transition-transform duration-200",
                        isActive ? "h-5 w-5" : "h-5 w-5 group-hover:scale-110"
                      )} />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* View Modes - Only show when on Dashboard */}
          {isOnDashboard && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => setViewsExpanded(!viewsExpanded)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
                  isCollapsed && "justify-center"
                )}
              >
                {!isCollapsed && <span>View Modes</span>}
                <Eye className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  viewsExpanded && !isCollapsed && "rotate-180"
                )} />
              </button>
              
              {viewsExpanded && (
                <ul className="space-y-1 mt-2">
                  {viewModes.map((item) => {
                    const isActive = viewMode === item.mode
                    const Icon = item.icon
                    
                    return (
                      <li key={item.mode}>
                        <button
                          onClick={() => setViewMode(item.mode)}
                          className={cn(
                            'group w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 touch-target',
                            isActive
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:shadow-sm'
                          )}
                          title={isCollapsed ? item.name : item.description}
                        >
                          <Icon className={cn(
                            "flex-shrink-0 transition-transform duration-200",
                            isActive ? "h-4 w-4" : "h-4 w-4 group-hover:scale-110"
                          )} />
                          {!isCollapsed && (
                            <span className="truncate text-left">{item.name}</span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link
              href="/app/settings"
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 touch-target',
                pathname === '/app/settings'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:shadow-md'
              )}
              title={isCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-5 w-5 flex-shrink-0 group-hover:rotate-90 transition-transform duration-300" />
              {!isCollapsed && <span className="truncate">Settings</span>}
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
  const { viewMode, setViewMode } = useTasksStore()
  const [viewsExpanded, setViewsExpanded] = useState(true)
  const isOnDashboard = pathname === '/app'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl transform transition-transform duration-300 ease-out">
        <div className="h-full px-4 py-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Navigation</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Main Navigation */}
            <div>
              <h3 className="mb-3 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Main Pages
              </h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/app')
                  const Icon = item.icon
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 touch-target',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className={cn(
                            "text-xs mt-0.5",
                            isActive ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                          )}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* View Modes - Only on Dashboard */}
            {isOnDashboard && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => setViewsExpanded(!viewsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <span>View Modes</span>
                  <Eye className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    viewsExpanded && "rotate-180"
                  )} />
                </button>
                
                {viewsExpanded && (
                  <ul className="space-y-2 mt-3">
                    {viewModes.map((item) => {
                      const isActive = viewMode === item.mode
                      const Icon = item.icon
                      
                      return (
                        <li key={item.mode}>
                          <button
                            onClick={() => {
                              setViewMode(item.mode)
                              onClose()
                            }}
                            className={cn(
                              'group w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 touch-target',
                              isActive
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                            )}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{item.name}</div>
                              <div className={cn(
                                "text-xs mt-0.5",
                                isActive ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
                              )}>
                                {item.description}
                              </div>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Link
                href="/app/settings"
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 touch-target',
                  pathname === '/app/settings'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}