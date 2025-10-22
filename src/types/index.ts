export interface Task {
  id: string
  title: string
  duration: string
  priority: 'high' | 'medium' | 'low'
  entity_type: 'task' | 'event' | 'activity' | 'process'
  completed: boolean
  chain_id?: string
  x?: number
  y?: number
  value?: number  // 1-10 for bubble chart
  risk?: number   // 1-10 for bubble chart
  category?: 'big_bets' | 'line_extensions' | 'ltos' | 'other'
  npv?: number    // Size of bubble (millions)
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
