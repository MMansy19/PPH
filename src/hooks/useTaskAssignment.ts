import { useState, useCallback } from 'react'
import { teamService } from '@/lib/team-service'
import type { TaskWithTeam, AssignTaskInput } from '@/types/team'

/**
 * Hook for task assignment management
 * 
 * Provides:
 * - Assign/unassign tasks
 * - Load team tasks
 * - Load user assigned tasks
 * - Loading and error states
 */
export function useTaskAssignment(teamId?: string) {
  const [tasks, setTasks] = useState<TaskWithTeam[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Assigns a task to a team member
   */
  const assignTask = useCallback(async (taskId: string, assigneeId: string, assignedBy: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const input: AssignTaskInput = { task_id: taskId, assignee_id: assigneeId }
      const response = await teamService.assignTask(input, assignedBy)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Update task in local state
      setTasks(prev => 
        prev.map(t => t.id === taskId ? response.data! : t)
      )

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign task'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Unassigns a task
   */
  const unassignTask = useCallback(async (taskId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.unassignTask(taskId)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Update task in local state
      setTasks(prev => 
        prev.map(t => t.id === taskId ? response.data! : t)
      )

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unassign task'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Loads all tasks for a team
   */
  const loadTeamTasks = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.getTeamTasks(id)
      
      if (response.error) {
        setError(response.error.message)
        setTasks([])
        return []
      }

      setTasks(response.data || [])
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load team tasks'
      setError(message)
      setTasks([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Loads tasks assigned to a specific user
   */
  const loadUserTasks = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.getUserAssignedTasks(userId)
      
      if (response.error) {
        setError(response.error.message)
        setTasks([])
        return []
      }

      setTasks(response.data || [])
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user tasks'
      setError(message)
      setTasks([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Reassigns a task from one user to another
   */
  const reassignTask = useCallback(async (taskId: string, newAssigneeId: string, assignedBy: string) => {
    return assignTask(taskId, newAssigneeId, assignedBy)
  }, [assignTask])

  /**
   * Refreshes tasks for the current team
   */
  const refresh = useCallback(async () => {
    if (teamId) {
      await loadTeamTasks(teamId)
    }
  }, [teamId, loadTeamTasks])

  /**
   * Filters tasks by assignee
   */
  const getTasksByAssignee = useCallback((assigneeId: string) => {
    return tasks.filter(t => t.assigned_to === assigneeId)
  }, [tasks])

  /**
   * Gets unassigned tasks
   */
  const getUnassignedTasks = useCallback(() => {
    return tasks.filter(t => !t.assigned_to)
  }, [tasks])

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    tasks,
    isLoading,
    error,

    // Methods
    assignTask,
    unassignTask,
    reassignTask,
    loadTeamTasks,
    loadUserTasks,
    refresh,

    // Utilities
    getTasksByAssignee,
    getUnassignedTasks,
    clearError,

    // Setters
    setTasks
  }
}
