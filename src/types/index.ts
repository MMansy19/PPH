export interface Workspace {
  id: string
  user_id: string
  name: string
  description?: string
  theme_color?: string
  icon?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  workspace_id: string
  project_id?: string  // New: Direct project association
  title: string
  description?: string
  duration: string
  priority: 'high' | 'medium' | 'low'
  entity_type: 'task' | 'event' | 'activity' | 'process'
  status: 'todo' | 'in-progress' | 'review' | 'done'  // Added 'review' state
  completed: boolean
  chain_id?: string
  x?: number
  y?: number
  value?: number  // 1-10 for bubble chart
  risk?: number   // 1-10 for bubble chart
  category?: 'big_bets' | 'line_extensions' | 'ltos' | 'other'
  npv?: number    // Size of bubble (millions)
  created_at?: string  // ISO date string for calendar
  start_date?: string  // ISO date string for calendar start
  end_date?: string    // ISO date string for calendar end
  due_date?: string    // ISO date string
  tags?: string[]
  assignee?: string
  
  // Team collaboration fields
  team_id?: string
  assigned_to?: string
  assigned_by?: string
  assigned_at?: string
}

export type ViewMode = 'board' | 'table' | 'portfolio' | 'map' | 'calendar' | 'list'

export interface BubbleData {
  x: number
  y: number
  z: number
  name: string
  category: Task['category']
  fill: string
}
