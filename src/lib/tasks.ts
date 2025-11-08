import { createClient } from '@/lib/supabase'
import { Task as TaskType } from '@/types'

export type Task = TaskType

export class TasksService {
  private supabase = createClient()

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null; error: any }> {
    try {
      // Check if user is authenticated
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      console.log('Creating task for user:', user.id, 'in workspace:', task.workspace_id, 'project:', task.project_id)

      // Validate project_id is provided for new multi-project architecture
      if (!task.project_id) {
        return { data: null, error: { message: 'Project ID is required to create a task' } }
      }

      // Convert percentage values to 1-10 scale for database
      const taskData = {
        ...task,
        value: task.value ? Math.max(1, Math.min(10, Math.round(task.value / 10))) : 5,
        risk: task.risk ? Math.max(1, Math.min(10, Math.round(task.risk / 10))) : 5,
        priority: task.priority?.toLowerCase() as 'high' | 'medium' | 'low',
        duration: task.duration || '1h',
        entity_type: task.entity_type || 'task' as const,
        completed: task.completed || false,
        // Convert empty strings to null for date fields
        start_date: task.start_date || null,
        end_date: task.end_date || null,
        due_date: task.due_date || null
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
        // Convert database values back to percentage scale for UI
        if (data) {
          data.value = data.value * 10
          data.risk = data.risk * 10
        }
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
      // Convert empty strings to null for date fields
      if ('start_date' in updates) {
        updateData.start_date = updates.start_date || null
      }
      if ('end_date' in updates) {
        updateData.end_date = updates.end_date || null
      }
      if ('due_date' in updates) {
        updateData.due_date = updates.due_date || null
      }

      const { data, error } = await this.supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      // Convert database values back to percentage scale for UI
      if (data) {
        data.value = data.value * 10
        data.risk = data.risk * 10
      }

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
        value: task.value ? task.value * 10 : 50,
        risk: task.risk ? task.risk * 10 : 50,
        status: task.status as 'todo' | 'in-progress' | 'review' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        entity_type: task.entity_type as 'task' | 'event' | 'activity' | 'process',
        category: task.category as 'big_bets' | 'line_extensions' | 'ltos' | 'other'
      }))

      return { data: tasksWithPercentages || [], error }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return { data: null, error }
    }
  }

  async getTasksByProject(projectId: string): Promise<{ data: Task[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      // Convert database values back to percentage scale for UI
      const tasksWithPercentages = data?.map(task => ({
        ...task,
        value: task.value ? task.value * 10 : 50,
        risk: task.risk ? task.risk * 10 : 50,
        status: task.status as 'todo' | 'in-progress' | 'review' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        entity_type: task.entity_type as 'task' | 'event' | 'activity' | 'process',
        category: task.category as 'big_bets' | 'line_extensions' | 'ltos' | 'other'
      }))

      return { data: tasksWithPercentages || [], error }
    } catch (error) {
      console.error('Error fetching project tasks:', error)
      return { data: null, error }
    }
  }

  async getTasksByTeamAndProject(teamId: string, projectId: string): Promise<{ data: Task[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('team_id', teamId)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      // Convert database values back to percentage scale for UI
      const tasksWithPercentages = data?.map(task => ({
        ...task,
        value: task.value ? task.value * 10 : 50,
        risk: task.risk ? task.risk * 10 : 50,
        status: task.status as 'todo' | 'in-progress' | 'review' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        entity_type: task.entity_type as 'task' | 'event' | 'activity' | 'process',
        category: task.category as 'big_bets' | 'line_extensions' | 'ltos' | 'other'
      }))

      return { data: tasksWithPercentages || [], error }
    } catch (error) {
      console.error('Error fetching team project tasks:', error)
      return { data: null, error }
    }
  }

  async moveTaskToProject(taskId: string, projectId: string): Promise<{ data: Task | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .update({ project_id: projectId })
        .eq('id', taskId)
        .select()
        .single()

      // Convert database values back to percentage scale for UI
      if (data) {
        data.value = data.value * 10
        data.risk = data.risk * 10
      }

      return { data, error }
    } catch (error) {
      console.error('Error moving task to project:', error)
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
        data.value = data.value ? data.value * 10 : 50
        data.risk = data.risk ? data.risk * 10 : 50
        data.status = data.status as 'todo' | 'in-progress' | 'review' | 'done'
        data.priority = data.priority as 'high' | 'medium' | 'low'
        data.entity_type = data.entity_type as 'task' | 'event' | 'activity' | 'process'
        data.category = data.category as 'big_bets' | 'line_extensions' | 'ltos' | 'other'
      }

      return { data, error }
    } catch (error) {
      console.error('Error fetching task:', error)
      return { data: null, error }
    }
  }
}

export const tasksService = new TasksService()