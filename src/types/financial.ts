// Financial Management System Types
export interface Department {
  id: string
  name: string
  description?: string
  manager_id?: string
  budget: number
  created_at: string
  updated_at: string
}

export interface TransactionCategory {
  id: string
  name: string
  type: 'income' | 'expense' | 'both'
  description?: string
  color: string
  created_at: string
}

export interface FinancialTransaction {
  id: string
  user_id: string
  department_id?: string
  category_id?: string
  title: string
  description?: string
  amount: number
  type: 'income' | 'expense'
  status: 'pending' | 'completed' | 'cancelled'
  transaction_date: string
  due_date?: string
  reference_number?: string
  receipt_url?: string
  tags?: string[]
  created_at: string
  updated_at: string
  created_by?: string
  
  // Populated fields when joined
  department?: Department
  category?: TransactionCategory
  creator?: {
    id: string
    email: string
    name?: string
  }
}

export interface EmployeeSalary {
  id: string
  user_id: string
  department_id?: string
  base_salary: number
  currency: string
  pay_frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'
  bonuses: number
  commissions: number
  deductions: number
  pay_period_start: string
  pay_period_end: string
  payment_date?: string
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  total_amount: number
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  
  // Populated fields
  department?: Department
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface TransactionComment {
  id: string
  transaction_id: string
  user_id: string
  comment: string
  created_at: string
  updated_at: string
  
  // Populated fields
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface FinancialAuditLog {
  id: string
  user_id?: string
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  created_at: string
  
  // Populated fields
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface FinancialBudget {
  id: string
  department_id?: string
  category_id?: string
  name: string
  budget_amount: number
  spent_amount: number
  remaining_amount: number
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'suspended'
  created_at: string
  updated_at: string
  created_by?: string
  
  // Populated fields
  department?: Department
  category?: TransactionCategory
}

// Financial summary and analytics types
export interface FinancialSummary {
  total_income: number
  total_expenses: number
  net_amount: number
  transaction_count: number
}

export interface MonthlyFinancialSummary {
  month: string
  type: 'income' | 'expense'
  department_id?: string
  total_amount: number
  transaction_count: number
  average_amount: number
}

export interface DepartmentBudgetStatus {
  department_id: string
  department_name: string
  allocated_budget: number
  spent_amount: number
  remaining_budget: number
  budget_utilization_percentage: number
}

// Chart data types
export interface FinancialChartData {
  name: string
  income: number
  expense: number
  net: number
  date?: string
}

export interface CategoryChartData {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface TrendData {
  period: string
  value: number
  type: 'income' | 'expense' | 'net'
}

// Form types
export interface CreateTransactionForm {
  title: string
  description?: string
  amount: number
  type: 'income' | 'expense'
  transaction_date: string
  due_date?: string
  department_id?: string
  category_id?: string
  reference_number?: string
  tags?: string[]
}

export interface CreateDepartmentForm {
  name: string
  description?: string
  manager_id?: string
  budget: number
}

export interface CreateSalaryForm {
  user_id: string
  department_id?: string
  base_salary: number
  currency: string
  pay_frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'
  bonuses?: number
  commissions?: number
  deductions?: number
  pay_period_start: string
  pay_period_end: string
  payment_date?: string
  notes?: string
}

export interface CreateBudgetForm {
  department_id?: string
  category_id?: string
  name: string
  budget_amount: number
  start_date: string
  end_date: string
}

// Filter and pagination types
export interface TransactionFilters {
  type?: 'income' | 'expense'
  status?: 'pending' | 'completed' | 'cancelled'
  department_id?: string
  category_id?: string
  start_date?: string
  end_date?: string
  min_amount?: number
  max_amount?: number
  tags?: string[]
  search?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Financial dashboard types
export interface FinancialDashboardData {
  summary: FinancialSummary
  monthly_trends: FinancialChartData[]
  category_breakdown: CategoryChartData[]
  recent_transactions: FinancialTransaction[]
  budget_status: DepartmentBudgetStatus[]
  pending_transactions: FinancialTransaction[]
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  date_range: {
    start_date: string
    end_date: string
  }
  filters?: TransactionFilters
  include_categories?: boolean
  include_departments?: boolean
  include_comments?: boolean
}

// User roles for financial system
export type FinancialUserRole = 'admin' | 'manager' | 'user' | 'viewer'

export interface FinancialUserPermissions {
  can_view_all_transactions: boolean
  can_create_transactions: boolean
  can_edit_transactions: boolean
  can_delete_transactions: boolean
  can_manage_departments: boolean
  can_manage_budgets: boolean
  can_manage_salaries: boolean
  can_view_audit_logs: boolean
  can_export_data: boolean
}