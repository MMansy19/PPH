'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Task } from '@/types'
import { useTasksStore } from '@/store/useTasksStore'

export function useTasks() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { 
    tasks, 
    setTasks, 
    addTask: addTaskToStore, 
    updateTask: updateTaskInStore, 
    deleteTask: deleteTaskFromStore 
  } = useTasksStore()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase.from('tasks').select('*')
      if (fetchError) throw fetchError
      setTasks(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks'
      setError(errorMessage)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task: Omit<Task, 'id'>) => {
    setError(null)
    try {
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()
      
      if (insertError) throw insertError
      if (data) addTaskToStore(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add task'
      setError(errorMessage)
      console.error('Error adding task:', err)
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
      
      if (updateError) throw updateError
      updateTaskInStore(id, updates)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task'
      setError(errorMessage)
      console.error('Error updating task:', err)
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    setError(null)
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      deleteTaskFromStore(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task'
      setError(errorMessage)
      console.error('Error deleting task:', err)
      throw err
    }
  }

  return { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    loading, 
    error,
    refetch: fetchTasks 
  }
}
