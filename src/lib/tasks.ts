import { createClient } from '@/lib/supabase'

export interface Task {
  id?: string
  workspace_id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  category: 'big_bets' | 'line_extensions' | 'ltos' | 'other'
  value: number // 1-10 scale, will be converted for database
  risk: number // 1-10 scale, will be converted for database
  status: string
  npv?: number
  due_date?: string
  start_date?: string
  tags?: string[]
  assignee?: string
  completed?: boolean
  created_at?: string
  updated_at?: string
}

export class TasksService {
  private supabase = createClient()

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null; error: any }> {
    try {
      // Check if user is authenticated
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      console.log('Creating task for user:', user.id, 'in workspace:', task.workspace_id)

      // Convert percentage values to 1-10 scale for database
      const taskData = {
        ...task,
        value: Math.max(1, Math.min(10, Math.round(task.value / 10))),
        risk: Math.max(1, Math.min(10, Math.round(task.risk / 10))),
        priority: task.priority.toLowerCase()
      }

      console.log('Task data to insert:', taskData)

      const { data, error } = await this.supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
      } else {
        console.log('Task created successfully:', data)
      }

      return { data, error }
    } catch (error) {
      console.error('Error creating task:', error)
      return { data: null, error }
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<{ data: Task | null; error: any }> {
    try {
      // Convert percentage values to 1-10 scale for database if provided
      const updateData: any = { ...updates }
      if (updates.value !== undefined) {
        updateData.value = Math.max(1, Math.min(10, Math.round(updates.value / 10)))
      }
      if (updates.risk !== undefined) {
        updateData.risk = Math.max(1, Math.min(10, Math.round(updates.risk / 10)))
      }
      if (updates.priority) {
        updateData.priority = updates.priority.toLowerCase()
      }

      const { data, error } = await this.supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error updating task:', error)
      return { data: null, error }
    }
  }

  async deleteTask(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Error deleting task:', error)
      return { error }
    }
  }

  async getTasksByWorkspace(workspaceId: string): Promise<{ data: Task[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      // Convert database values back to percentage scale for UI
      const tasksWithPercentages = data?.map(task => ({
        ...task,
        value: task.value * 10,
        risk: task.risk * 10
      }))

      return { data: tasksWithPercentages || [], error }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return { data: null, error }
    }
  }

  async getTask(id: string): Promise<{ data: Task | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      // Convert database values back to percentage scale for UI
      if (data) {
        data.value = data.value * 10
        data.risk = data.risk * 10
      }

      return { data, error }
    } catch (error) {
      console.error('Error fetching task:', error)
      return { data: null, error }
    }
  }
}

export const tasksService = new TasksService()