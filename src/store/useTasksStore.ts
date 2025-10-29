import { create } from 'zustand'
import { Task, ViewMode } from '@/types'
import { tasksService } from '@/lib/tasks'

interface Store {
  tasks: Task[]
  loading: boolean
  error: string | null
  viewMode: ViewMode
  currentWorkspaceId: string | null
  setViewMode: (mode: ViewMode) => void
  setCurrentWorkspaceId: (id: string) => void
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  loadTasks: (workspaceId: string) => Promise<void>
  createTask: (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>
  editTask: (id: string, updates: Partial<Task>) => Promise<boolean>
  removeTask: (id: string) => Promise<boolean>
  getTasksByWorkspace: (workspaceId: string) => Task[]
  getTasksByStatus: (workspaceId: string, status: 'todo' | 'in-progress' | 'done') => Task[]
  getTasksByCategory: (workspaceId: string, category: Task['category']) => Task[]
}

export const useTasksStore = create<Store>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  viewMode: 'portfolio',
  currentWorkspaceId: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  
  setCurrentWorkspaceId: (id) => {
    set({ currentWorkspaceId: id })
    // Automatically load tasks when workspace changes
    if (id) {
      get().loadTasks(id)
    }
  },
  
  setTasks: (tasks) => set({ tasks, error: null }),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  loadTasks: async (workspaceId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await tasksService.getTasksByWorkspace(workspaceId)
      if (error) {
        set({ error: error.message || 'Failed to load tasks', loading: false })
      } else {
        set({ tasks: data || [], loading: false })
      }
    } catch (error: any) {
      set({ error: error.message || 'An unexpected error occurred', loading: false })
    }
  },

  createTask: async (taskData) => {
    try {
      const { data, error } = await tasksService.createTask(taskData)
      if (error) {
        set({ error: error.message || 'Failed to create task' })
        return false
      } else if (data) {
        get().addTask(data)
        return true
      }
    } catch (error: any) {
      set({ error: error.message || 'An unexpected error occurred' })
    }
    return false
  },

  editTask: async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await tasksService.updateTask(id, updates)
      if (error) {
        set({ error: error.message || 'Failed to update task' })
        return false
      } else if (data) {
        get().updateTask(id, data)
        return true
      }
    } catch (error: any) {
      set({ error: error.message || 'An unexpected error occurred' })
    }
    return false
  },

  removeTask: async (id: string) => {
    try {
      const { error } = await tasksService.deleteTask(id)
      if (error) {
        set({ error: error.message || 'Failed to delete task' })
        return false
      } else {
        get().deleteTask(id)
        return true
      }
    } catch (error: any) {
      set({ error: error.message || 'An unexpected error occurred' })
    }
    return false
  },

  getTasksByWorkspace: (workspaceId) => {
    return get().tasks.filter(task => task.workspace_id === workspaceId)
  },
  
  getTasksByStatus: (workspaceId, status) => {
    return get().tasks.filter(task => task.workspace_id === workspaceId && task.status === status)
  },

  getTasksByCategory: (workspaceId, category) => {
    return get().tasks.filter(task => task.workspace_id === workspaceId && task.category === category)
  },
}))
