import { create } from 'zustand'
import { Task, ViewMode } from '@/types'

interface Store {
  tasks: Task[]
  viewMode: ViewMode
  currentWorkspaceId: string | null
  setViewMode: (mode: ViewMode) => void
  setCurrentWorkspaceId: (id: string) => void
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTasksByWorkspace: (workspaceId: string) => Task[]
  getTasksByStatus: (workspaceId: string, status: 'todo' | 'in-progress' | 'done') => Task[]
}

export const useTasksStore = create<Store>((set, get) => ({
  tasks: [],
  viewMode: 'portfolio',
  currentWorkspaceId: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  getTasksByWorkspace: (workspaceId) => {
    return get().tasks.filter(task => task.workspace_id === workspaceId)
  },
  getTasksByStatus: (workspaceId, status) => {
    return get().tasks.filter(task => task.workspace_id === workspaceId && task.status === status)
  },
}))
