'use client'

import { useState, useEffect } from 'react'
import { financialService } from '@/lib/financial-service'
import type { Department, TransactionCategory } from '@/types/financial'

// Sample data that can be inserted if database is empty
const SAMPLE_CATEGORIES: Omit<TransactionCategory, 'id' | 'created_at'>[] = [
  { name: 'Sales Revenue', type: 'income', description: 'Revenue from product/service sales', color: '#10b981' },
  { name: 'Consulting Revenue', type: 'income', description: 'Revenue from consulting services', color: '#059669' },
  { name: 'Investment Income', type: 'income', description: 'Returns from investments', color: '#047857' },
  { name: 'Other Income', type: 'income', description: 'Miscellaneous income sources', color: '#064e3b' },
  
  { name: 'Office Rent', type: 'expense', description: 'Monthly office space rental', color: '#ef4444' },
  { name: 'Utilities', type: 'expense', description: 'Electricity, water, internet bills', color: '#dc2626' },
  { name: 'Marketing', type: 'expense', description: 'Advertising and promotional costs', color: '#b91c1c' },
  { name: 'Software Subscriptions', type: 'expense', description: 'SaaS tools and software licenses', color: '#991b1b' },
  { name: 'Travel & Transport', type: 'expense', description: 'Business travel and transportation', color: '#7f1d1d' },
  { name: 'Office Supplies', type: 'expense', description: 'Stationery, equipment, furniture', color: '#fbbf24' },
  { name: 'Professional Services', type: 'expense', description: 'Legal, accounting, consulting fees', color: '#f59e0b' },
  { name: 'Equipment', type: 'expense', description: 'Computer hardware and equipment', color: '#92400e' },
  { name: 'Other Expenses', type: 'expense', description: 'Miscellaneous business expenses', color: '#451a03' }
]

const SAMPLE_DEPARTMENTS: Omit<Department, 'id' | 'created_at' | 'updated_at' | 'manager_id'>[] = [
  { name: 'Engineering', description: 'Software development and technical operations', budget: 150000 },
  { name: 'Marketing', description: 'Marketing, advertising, and customer acquisition', budget: 75000 },
  { name: 'Sales', description: 'Sales team and business development', budget: 100000 },
  { name: 'Operations', description: 'General operations and administration', budget: 50000 },
  { name: 'Finance', description: 'Financial management and accounting', budget: 40000 },
  { name: 'Human Resources', description: 'HR and employee management', budget: 30000 }
]

export function useFinancialData() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initializeFinancialData()
  }, [])

  const initializeFinancialData = async () => {
    try {
      setLoading(true)
      
      // Try to load existing data
      const [existingDepartments, existingCategories] = await Promise.all([
        financialService.getDepartments(),
        financialService.getCategories()
      ])

      // If no data exists, create sample data
      if (existingDepartments.length === 0) {
        console.log('No departments found, creating sample data...')
        for (const dept of SAMPLE_DEPARTMENTS) {
          try {
            await financialService.createDepartment(dept)
          } catch (error) {
            console.warn('Failed to create department:', dept.name, error)
          }
        }
      }

      if (existingCategories.length === 0) {
        console.log('No categories found, creating sample data...')
        for (const cat of SAMPLE_CATEGORIES) {
          try {
            await financialService.createCategory(cat)
          } catch (error) {
            console.warn('Failed to create category:', cat.name, error)
          }
        }
      }

      // Reload data after potential initialization
      const [finalDepartments, finalCategories] = await Promise.all([
        financialService.getDepartments(),
        financialService.getCategories()
      ])

      setDepartments(finalDepartments)
      setCategories(finalCategories)
      setInitialized(true)
    } catch (error) {
      console.error('Error initializing financial data:', error)
      // Fall back to empty arrays if there's an error
      setDepartments([])
      setCategories([])
      setInitialized(true)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      const [deps, cats] = await Promise.all([
        financialService.getDepartments(),
        financialService.getCategories()
      ])
      setDepartments(deps)
      setCategories(cats)
    } catch (error) {
      console.error('Error refreshing financial data:', error)
    }
  }

  return {
    departments,
    categories,
    loading,
    initialized,
    refreshData
  }
}