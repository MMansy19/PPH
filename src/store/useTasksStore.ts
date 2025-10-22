import { create } from 'zustand'
import { Task, ViewMode } from '@/types'

interface Store {
  tasks: Task[]
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
}

export const useTasksStore = create<Store>((set) => ({
  tasks: [
    // BIG BETS (Green) - High Value, Low Risk
    { 
      id: '1', title: 'A: Core Product Launch', duration: '12w', priority: 'high', 
      entity_type: 'process', value: 9, risk: 2, category: 'big_bets', npv: 8, 
      completed: false 
    },
    { 
      id: '2', title: 'T: Market Expansion', duration: '10w', priority: 'high', 
      entity_type: 'process', value: 8, risk: 3, category: 'big_bets', npv: 7, 
      completed: false 
    },
    { 
      id: '3', title: 'D: Strategic Partnership', duration: '8w', priority: 'high', 
      entity_type: 'process', value: 9, risk: 2, category: 'big_bets', npv: 6, 
      completed: false 
    },
    
    // LINE EXTENSIONS (Orange) - Medium Value, Medium Risk  
    { 
      id: '4', title: 'C: Product Variant', duration: '6w', priority: 'medium', 
      entity_type: 'activity', value: 6, risk: 5, category: 'line_extensions', npv: 3, 
      completed: false 
    },
    { 
      id: '5', title: 'K: Feature Addition', duration: '4w', priority: 'medium', 
      entity_type: 'task', value: 5, risk: 6, category: 'line_extensions', npv: 2, 
      completed: false 
    },
    { 
      id: '6', title: 'M: Service Extension', duration: '5w', priority: 'medium', 
      entity_type: 'activity', value: 6, risk: 5, category: 'line_extensions', npv: 2.5, 
      completed: false 
    },
    { 
      id: '7', title: 'P: Platform Update', duration: '4w', priority: 'medium', 
      entity_type: 'task', value: 5, risk: 4, category: 'line_extensions', npv: 1.8, 
      completed: false 
    },
    
    // LTOS (Blue) - Low Value, Low Risk
    { 
      id: '8', title: 'V: Small Fix', duration: '1w', priority: 'low', 
      entity_type: 'task', value: 2, risk: 1, category: 'ltos', npv: 0.5, 
      completed: true 
    },
    { 
      id: '9', title: 'A: Bug Fix', duration: '2d', priority: 'low', 
      entity_type: 'task', value: 3, risk: 2, category: 'ltos', npv: 0.8, 
      completed: false 
    },
    { 
      id: '10', title: 'E: UI Polish', duration: '1w', priority: 'low', 
      entity_type: 'task', value: 2, risk: 1, category: 'ltos', npv: 0.6, 
      completed: false 
    },
    { 
      id: '11', title: 'R: Documentation', duration: '3d', priority: 'low', 
      entity_type: 'task', value: 3, risk: 1, category: 'ltos', npv: 0.4, 
      completed: false 
    },
    
    // OTHER (Red) - High Risk, Mixed Value
    { 
      id: '12', title: 'B: New Market Entry', duration: '8w', priority: 'high', 
      entity_type: 'process', value: 4, risk: 8, category: 'other', npv: 1.5, 
      completed: false 
    },
    { 
      id: '13', title: 'X: Experimental Tech', duration: '6w', priority: 'medium', 
      entity_type: 'activity', value: 5, risk: 9, category: 'other', npv: 2, 
      completed: false 
    },
    { 
      id: '14', title: 'Y: R&D Project', duration: '10w', priority: 'medium', 
      entity_type: 'process', value: 3, risk: 7, category: 'other', npv: 1.2, 
      completed: false 
    },
    { 
      id: '15', title: 'Z: High Risk Bet', duration: '12w', priority: 'low', 
      entity_type: 'process', value: 2, risk: 8, category: 'other', npv: 0.9, 
      completed: false 
    },
  ],
  viewMode: 'portfolio',
  setViewMode: (mode) => set({ viewMode: mode }),
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
}))
