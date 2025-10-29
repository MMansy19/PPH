'use client'

import FinancialNavigation from './FinancialNavigation'
import { Card } from '@/components/ui/card'

export default function DepartmentManagement() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FinancialNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Departments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage departments and budgets
          </p>
        </div>

        <Card className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Department management interface coming soon...
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              This will include department creation, budget management, and user assignments
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}