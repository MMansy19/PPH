import { createClient } from '@/lib/supabase'
import type {
  FinancialTransaction,
  Department,
  TransactionCategory,
  EmployeeSalary,
  FinancialBudget,
  TransactionComment,
  FinancialSummary,
  TransactionFilters,
  PaginationParams,
  PaginatedResponse,
  CreateTransactionForm,
  CreateDepartmentForm,
  CreateSalaryForm,
  CreateBudgetForm
} from '@/types/financial'

export class FinancialService {
  private supabase = createClient()

  // ============================================
  // TRANSACTIONS
  // ============================================

  async getTransactions(
    filters?: TransactionFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<FinancialTransaction>> {
    let query = this.supabase
      .from('financial_transactions')
      .select(`
        *,
        department:departments(*),
        category:transaction_categories(*)
      `)

    // Apply filters
    if (filters) {
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.department_id) {
        query = query.eq('department_id', filters.department_id)
      }
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id)
      }
      if (filters.start_date) {
        query = query.gte('transaction_date', filters.start_date)
      }
      if (filters.end_date) {
        query = query.lte('transaction_date', filters.end_date)
      }
      if (filters.min_amount) {
        query = query.gte('amount', filters.min_amount)
      }
      if (filters.max_amount) {
        query = query.lte('amount', filters.max_amount)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }
    }

    // Apply pagination and sorting
    if (pagination) {
      const { page, limit, sort_by = 'transaction_date', sort_order = 'desc' } = pagination
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: (data as any[]) || [],
      total: count || 0,
      page: pagination?.page || 1,
      limit: pagination?.limit || 50,
      total_pages: Math.ceil((count || 0) / (pagination?.limit || 50))
    }
  }

  async getTransaction(id: string): Promise<FinancialTransaction> {
    const { data, error } = await this.supabase
      .from('financial_transactions')
      .select(`
        *,
        department:departments(*),
        category:transaction_categories(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as FinancialTransaction
  }

  async createTransaction(transaction: CreateTransactionForm): Promise<FinancialTransaction> {
    try {
      // Enhanced authentication check
      const { data: user, error: authError } = await this.supabase.auth.getUser()
      if (authError) {
        console.error('Auth error:', authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }
      if (!user.user) {
        throw new Error('User not authenticated - no user data')
      }

      console.log('Creating transaction for user:', user.user.id)
      console.log('Transaction data:', transaction)

      const transactionData = {
        ...transaction,
        user_id: user.user.id,
        created_by: user.user.id
      }

      console.log('Final transaction data:', transactionData)

      const { data, error } = await this.supabase
        .from('financial_transactions')
        .insert(transactionData)
        .select(`
          *,
          department:departments(*),
          category:transaction_categories(*)
        `)
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
      }
      
      console.log('Transaction created successfully:', data)
      return data as FinancialTransaction
    } catch (error) {
      console.error('Error in createTransaction:', error)
      throw error
    }
  }

  async updateTransaction(id: string, updates: Partial<CreateTransactionForm>): Promise<FinancialTransaction> {
    const { data, error } = await this.supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        department:departments(*),
        category:transaction_categories(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // ============================================
  // DEPARTMENTS
  // ============================================

  async getDepartments(): Promise<Department[]> {
    try {
      console.log('Fetching departments...')
      const { data: user, error: authError } = await this.supabase.auth.getUser()
      if (authError) {
        console.error('Auth error in getDepartments:', authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }
      if (!user.user) {
        throw new Error('User not authenticated')
      }

      console.log('User authenticated, fetching departments for user:', user.user.id)

      const { data, error } = await this.supabase
        .from('departments')
        .select('*')
        .order('name')

      if (error) {
        console.error('Database error fetching departments:', error)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        throw new Error(`Failed to fetch departments: ${error.message} (Code: ${error.code})`)
      }
      
      console.log('Departments fetched successfully:', data?.length || 0, 'records')
      return data || []
    } catch (error) {
      console.error('Error in getDepartments:', error)
      throw error
    }
  }

  async createDepartment(department: CreateDepartmentForm): Promise<Department> {
    try {
      const { data, error } = await this.supabase
        .from('departments')
        .insert(department)
        .select()
        .single()

      if (error) {
        console.error('Error creating department:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in createDepartment:', error)
      throw error
    }
  }

  async updateDepartment(id: string, updates: Partial<CreateDepartmentForm>): Promise<Department> {
    const { data, error } = await this.supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteDepartment(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('departments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // ============================================
  // CATEGORIES
  // ============================================

  async getCategories(): Promise<TransactionCategory[]> {
    try {
      console.log('Fetching transaction categories...')
      const { data: user, error: authError } = await this.supabase.auth.getUser()
      if (authError) {
        console.error('Auth error in getCategories:', authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }
      if (!user.user) {
        throw new Error('User not authenticated')
      }

      console.log('User authenticated, fetching categories for user:', user.user.id)

      const { data, error } = await this.supabase
        .from('transaction_categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Database error fetching categories:', error)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        throw new Error(`Failed to fetch categories: ${error.message} (Code: ${error.code})`)
      }
      
      console.log('Categories fetched successfully:', data?.length || 0, 'records')
      return data || []
    } catch (error) {
      console.error('Error in getCategories:', error)
      throw error
    }
  }

  async createCategory(category: Omit<TransactionCategory, 'id' | 'created_at'>): Promise<TransactionCategory> {
    try {
      const { data, error } = await this.supabase
        .from('transaction_categories')
        .insert(category)
        .select()
        .single()

      if (error) {
        console.error('Error creating category:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in createCategory:', error)
      throw error
    }
  }

  // ============================================
  // FINANCIAL SUMMARY & ANALYTICS
  // ============================================

  async getFinancialSummary(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<FinancialSummary> {
    let query = this.supabase
      .from('financial_transactions')
      .select('amount, type')
      .eq('status', 'completed')

    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (startDate) {
      query = query.gte('transaction_date', startDate)
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching financial summary:', error)
      return { total_income: 0, total_expenses: 0, net_amount: 0, transaction_count: 0 }
    }

    const summary = (data || []).reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.total_income += transaction.amount
        } else {
          acc.total_expenses += transaction.amount
        }
        acc.transaction_count += 1
        return acc
      },
      { total_income: 0, total_expenses: 0, net_amount: 0, transaction_count: 0 }
    )

    summary.net_amount = summary.total_income - summary.total_expenses
    return summary
  }

  async getMonthlyTrends(months: number = 12): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('monthly_financial_summary')
      .select('*')
      .order('month', { ascending: false })
      .limit(months)

    if (error) throw error
    return data || []
  }

  async getCategoryBreakdown(
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
  ): Promise<any[]> {
    let query = this.supabase
      .from('financial_transactions')
      .select(`
        amount,
        category:transaction_categories(name, color)
      `)
      .eq('status', 'completed')

    if (type) {
      query = query.eq('type', type)
    }
    if (startDate) {
      query = query.gte('transaction_date', startDate)
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  // ============================================
  // BUDGETS
  // ============================================

  async getBudgets(): Promise<FinancialBudget[]> {
    const { data, error } = await this.supabase
      .from('financial_budgets')
      .select(`
        *,
        department:departments(*),
        category:transaction_categories(*)
      `)
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createBudget(budget: CreateBudgetForm): Promise<FinancialBudget> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('financial_budgets')
      .insert({
        ...budget,
        created_by: user.user.id
      })
      .select(`
        *,
        department:departments(*),
        category:transaction_categories(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  // ============================================
  // COMMENTS
  // ============================================

  async getTransactionComments(transactionId: string): Promise<TransactionComment[]> {
    const { data, error } = await this.supabase
      .from('transaction_comments')
      .select('*')
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data as any[]) || []
  }

  async addTransactionComment(transactionId: string, comment: string): Promise<TransactionComment> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('transaction_comments')
      .insert({
        transaction_id: transactionId,
        user_id: user.user.id,
        comment
      })
      .select('*')
      .single()

    if (error) throw error
    return data as TransactionComment
  }

  // ============================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================

  subscribeToTransactions(callback: (payload: any) => void) {
    return this.supabase
      .channel('financial_transactions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'financial_transactions'
      }, callback)
      .subscribe()
  }

  subscribeToTransactionComments(transactionId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`transaction_comments_${transactionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transaction_comments',
        filter: `transaction_id=eq.${transactionId}`
      }, callback)
      .subscribe()
  }
}

// Export singleton instance
export const financialService = new FinancialService()