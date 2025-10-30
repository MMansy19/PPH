'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const { loading } = useRequireAuth('/auth/login?redirect=/app/analytics')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-responsive spacing-responsive min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Page Header */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-responsive-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-responsive text-muted-foreground">
          Advanced reports and analytics for your portfolio
        </p>
      </div>

      {/* Analytics Cards Grid - Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="card-responsive hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Total Tasks</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all workspaces
            </p>
          </CardContent>
        </Card>

        <Card className="card-responsive hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">0%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks completed on time
            </p>
          </CardContent>
        </Card>

        <Card className="card-responsive hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Active Projects</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
              <PieChart className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="card-responsive hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Productivity</CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks per week average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content - Responsive Grid */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 card-responsive">
          <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Overview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Your task completion trends over time
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="h-[250px] sm:h-[300px] md:h-[350px] flex-center text-muted-foreground bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed">
              <div className="text-center space-y-2">
                <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-gray-400" />
                <p className="text-xs sm:text-sm">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-responsive">
          <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Task Distribution</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Tasks by status and priority
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="h-[250px] sm:h-[300px] md:h-[350px] flex-center text-muted-foreground bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed">
              <div className="text-center space-y-2">
                <PieChart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-gray-400" />
                <p className="text-xs sm:text-sm">Distribution chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section - Responsive */}
      <Card className="card-responsive">
        <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg md:text-xl">Recent Activity</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Latest updates and changes across your workspaces
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
          <div className="space-y-4">
            <div className="flex-center py-8 sm:py-12 md:py-16 text-center">
              <div className="space-y-3">
                <Activity className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  No recent activity to display
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto px-4">
                  Activity will appear here as you work with tasks and projects
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
