'use client'
import { useState } from 'react'
import { AppNavigation, MobileAppNavigation } from '@/components/Layout/AppNavigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Desktop Sidebar */}
        <AppNavigation className="hidden lg:flex flex-shrink-0" />
        
        {/* Mobile Navigation */}
        <MobileAppNavigation 
          isOpen={mobileNavOpen} 
          onClose={() => setMobileNavOpen(false)} 
        />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileNavOpen(true)}
                className="touch-target"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
              <Breadcrumb className="hidden xs:flex" />
            </div>
          </div>
          
          {/* Page Content */}
          <div className="container-responsive py-6 sm:py-8">
            {/* Desktop Breadcrumb */}
            <div className="hidden lg:block mb-6">
              <Breadcrumb />
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}