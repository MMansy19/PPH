import { useState, useCallback, useEffect } from 'react'
import { teamService } from '@/lib/team-service'
import type {
  Team,
  TeamWithMembers,
  CreateTeamInput,
  UpdateTeamInput,
  TeamStatistics
} from '@/types/team'

/**
 * Hook for team management
 * 
 * Provides:
 * - Team CRUD operations
 * - Team statistics
 * - Loading and error states
 */
export function useTeam(teamId?: string) {
  const [team, setTeam] = useState<TeamWithMembers | null>(null)
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [statistics, setStatistics] = useState<TeamStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Loads a single team by ID
   */
  const loadTeam = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.getTeam(id)
      
      if (response.error) {
        setError(response.error.message)
        setTeam(null)
        return null
      }

      setTeam(response.data)
      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load team'
      setError(message)
      setTeam(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Loads all teams for a workspace
   */
  const loadWorkspaceTeams = useCallback(async (workspaceId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.getWorkspaceTeams(workspaceId)
      
      if (response.error) {
        setError(response.error.message)
        setTeams([])
        return []
      }

      setTeams(response.data || [])
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load teams'
      setError(message)
      setTeams([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Loads all teams for a user
   */
  const loadUserTeams = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.getUserTeams(userId)
      
      if (response.error) {
        setError(response.error.message)
        setTeams([])
        return []
      }

      setTeams(response.data || [])
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user teams'
      setError(message)
      setTeams([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Creates a new team
   */
  const createTeam = useCallback(async (input: CreateTeamInput, adminId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.createTeam(input, adminId)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Add to teams list if we're managing a list
      if (teams.length > 0) {
        const newTeamWithMembers: TeamWithMembers = {
          ...response.data!,
          members: [],
          member_count: 1 // Admin is automatically added
        }
        setTeams(prev => [newTeamWithMembers, ...prev])
      }

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create team'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [teams])

  /**
   * Updates a team
   */
  const updateTeam = useCallback(async (id: string, input: UpdateTeamInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.updateTeam(id, input)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Update in current team if it matches
      if (team?.id === id) {
        setTeam(prev => prev ? { ...prev, ...response.data } : null)
      }

      // Update in teams list
      setTeams(prev => 
        prev.map(t => t.id === id ? { ...t, ...response.data } : t)
      )

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update team'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [team])

  /**
   * Deletes a team
   */
  const deleteTeam = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.deleteTeam(id)
      
      if (response.error) {
        setError(response.error.message)
        return false
      }

      // Remove from current team if it matches
      if (team?.id === id) {
        setTeam(null)
      }

      // Remove from teams list
      setTeams(prev => prev.filter(t => t.id !== id))

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete team'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [team])

  /**
   * Loads team statistics
   */
  const loadStatistics = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.getTeamStatistics(id)
      
      if (response.error) {
        setError(response.error.message)
        setStatistics(null)
        return null
      }

      setStatistics(response.data)
      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load statistics'
      setError(message)
      setStatistics(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Checks if a user is a team admin
   */
  const isAdmin = useCallback(async (id: string, userId: string) => {
    try {
      return await teamService.isTeamAdmin(id, userId)
    } catch (err) {
      console.error('Error checking admin status:', err)
      return false
    }
  }, [])

  /**
   * Checks if a user is a team member
   */
  const isMember = useCallback(async (id: string, userId: string) => {
    try {
      return await teamService.isTeamMember(id, userId)
    } catch (err) {
      console.error('Error checking member status:', err)
      return false
    }
  }, [])

  /**
   * Refreshes the current team
   */
  const refresh = useCallback(async () => {
    if (teamId) {
      await loadTeam(teamId)
    }
  }, [teamId, loadTeam])

  // Auto-load team if teamId is provided
  useEffect(() => {
    if (teamId) {
      loadTeam(teamId)
    }
  }, [teamId, loadTeam])

  return {
    // State
    team,
    teams,
    statistics,
    isLoading,
    error,

    // Methods
    loadTeam,
    loadWorkspaceTeams,
    loadUserTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    loadStatistics,
    isAdmin,
    isMember,
    refresh
  }
}
