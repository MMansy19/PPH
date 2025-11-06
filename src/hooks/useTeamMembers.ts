import { useState, useCallback } from 'react'
import { teamService } from '@/lib/team-service'
import type {
  TeamMember,
  TeamMemberWithProfile,
  AddMemberInput,
  UpdateMemberInput,
  TeamRole
} from '@/types/team'

/**
 * Hook for team member management
 * 
 * Provides:
 * - Add/remove members
 * - Update member roles
 * - Transfer admin role
 * - Loading and error states
 */
export function useTeamMembers(teamId: string) {
  const [members, setMembers] = useState<TeamMemberWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Adds a new member to the team
   */
  const addMember = useCallback(async (username: string, invitedBy: string, role: TeamRole = 'member') => {
    setIsLoading(true)
    setError(null)

    try {
      const input: AddMemberInput = { team_id: teamId, username, role }
      const response = await teamService.addMember(input, invitedBy)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Refresh members list (in a real app, we'd fetch the updated member with profile)
      // For now, we'll just return the member
      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add member'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [teamId])

  /**
   * Removes a member from the team
   */
  const removeMember = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.removeMember(teamId, userId)
      
      if (response.error) {
        setError(response.error.message)
        return false
      }

      // Remove from local state
      setMembers(prev => prev.filter(m => m.user_id !== userId))
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove member'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [teamId])

  /**
   * Updates a member's role
   */
  const updateMemberRole = useCallback(async (userId: string, role: TeamRole) => {
    setIsLoading(true)
    setError(null)

    try {
      const input: UpdateMemberInput = { role }
      const response = await teamService.updateMemberRole(teamId, userId, input)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Update local state
      setMembers(prev => 
        prev.map(m => m.user_id === userId ? { ...m, role } : m)
      )

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update member role'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [teamId])

  /**
   * Transfers admin role to another member
   */
  const transferAdmin = useCallback(async (newAdminId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamService.transferAdmin(teamId, newAdminId)
      
      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Update local state - set new admin role and demote old admin
      setMembers(prev => 
        prev.map(m => ({
          ...m,
          role: m.user_id === newAdminId ? 'admin' : 
                m.role === 'admin' ? 'member' : 
                m.role
        }))
      )

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to transfer admin role'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [teamId])

  /**
   * Gets a member's role
   */
  const getMemberRole = useCallback(async (userId: string): Promise<TeamRole | null> => {
    try {
      const response = await teamService.getMemberRole(teamId, userId)
      
      if (response.error) {
        console.error('Error getting member role:', response.error)
        return null
      }

      return response.data
    } catch (err) {
      console.error('Error getting member role:', err)
      return null
    }
  }, [teamId])

  /**
   * Checks if a user can perform admin actions
   */
  const canManageTeam = useCallback(async (userId: string): Promise<boolean> => {
    const role = await getMemberRole(userId)
    return role === 'admin'
  }, [getMemberRole])

  /**
   * Resets error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    members,
    isLoading,
    error,

    // Methods
    addMember,
    removeMember,
    updateMemberRole,
    transferAdmin,
    getMemberRole,
    canManageTeam,
    clearError,

    // Setters (useful for manual updates from parent components)
    setMembers
  }
}
