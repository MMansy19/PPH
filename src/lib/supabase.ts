import { createBrowserClient } from '@supabase/ssr'
import { Task } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Client-side Supabase client
export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey)

// Legacy export for backward compatibility
export const supabase = createClient()

export async function getTasks(): Promise<Task[]> {
  try {
    const { data } = await supabase.from('tasks').select('*')
    return data || []
  } catch (error) {
    console.warn('Supabase not configured, using local data')
    return []
  }
}

export async function addTask(task: Omit<Task, 'id'>): Promise<Task> {
  const { data } = await supabase.from('tasks').insert(task).select().single()
  return data!
}
