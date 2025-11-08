import { createClient } from '@/lib/supabase'
import type {
  ServiceResponse,
  Team,
  TeamWithMembers,
  TeamMember,
  TeamMemberWithProfile,
  CreateTeamInput,
  UpdateTeamInput,
  AddMemberInput,
  UpdateMemberInput,
  AssignTaskInput,
  TeamRole,
  TeamStatistics,
  MemberWorkload,
  TaskWithTeam,
  TeamActivityLog,
  PaginatedResponse
} from '@/types/team'

/**
 * Team Service
 * 
 * Provides comprehensive team management functionality including:
 * - Team CRUD operations
 * - Member management (add, remove, update roles)
 * - Task assignment and reassignment
 * - Permission checks
 * - Team statistics and analytics
 */
export class TeamService {
  private supabase = createClient()

  // ========================================
  // TEAM CRUD OPERATIONS
  // ========================================

  /**
   * Creates a new team within a project
   * The current user becomes the team admin automatically
   */
  async createTeam(input: CreateTeamInput, adminId: string): Promise<ServiceResponse<Team>> {
    try {
      const { project_id, name, description, settings } = input

      // Validate that project_id is provided for new project-based architecture
      if (!project_id) {
        return {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Project ID is required to create a team',
            details: 'Teams must be assigned to a project in the new multi-project architecture'
          }
        }
      }

      // Get workspace_id from the project
      const { data: project, error: projectError } = await this.supabase
        .from('projects')
        .select('workspace_id')
        .eq('id', project_id)
        .single()

      if (projectError || !project) {
        return {
          data: null,
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found',
            details: projectError
          }
        }
      }

      // Insert team
      const { data: team, error } = await this.supabase
        .from('teams')
        .insert({
          project_id,
          workspace_id: project.workspace_id,
          name,
          description,
          admin_id: adminId,
          settings: settings || {},
          is_active: true
        })
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'CREATE_FAILED',
            message: 'Failed to create team',
            details: error
          }
        }
      }

      // Note: Admin is automatically added as member by trigger
      return {
        data: team as Team,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'CREATE_ERROR',
          message: 'An error occurred while creating team',
          details: error
        }
      }
    }
  }

  /**
   * Gets a single team by ID with member information
   */
  async getTeam(teamId: string): Promise<ServiceResponse<TeamWithMembers>> {
    try {
      // Get team basic info
      const { data: team, error: teamError } = await this.supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (teamError) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch team',
            details: teamError
          }
        }
      }

      // Get team members with profiles
      const { data: members, error: membersError } = await this.supabase
        .from('team_members')
        .select(`
          *,
          user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
        `)
        .eq('team_id', teamId)
        .order('joined_at')

      if (membersError) {
        return {
          data: null,
          error: {
            code: 'FETCH_MEMBERS_FAILED',
            message: 'Failed to fetch team members',
            details: membersError
          }
        }
      }

      const teamWithMembers: TeamWithMembers = {
        ...team as Team,
        members: members as TeamMemberWithProfile[],
        member_count: members.length
      }

      return {
        data: teamWithMembers,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching team',
          details: error
        }
      }
    }
  }

  /**
   * Gets all teams for a workspace (legacy method for backwards compatibility)
   */
  async getWorkspaceTeams(workspaceId: string): Promise<ServiceResponse<TeamWithMembers[]>> {
    try {
      const { data: teams, error } = await this.supabase
        .from('teams')
        .select(`
          *,
          members:team_members(
            *,
            user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
          )
        `)
        .eq('workspace_id', workspaceId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch workspace teams',
            details: error
          }
        }
      }

      const teamsWithMembers: TeamWithMembers[] = teams.map(team => ({
        ...team,
        member_count: team.members?.length || 0
      }))

      return {
        data: teamsWithMembers,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching workspace teams',
          details: error
        }
      }
    }
  }



  /**
   * Gets all teams for a specific project
   */
  async getProjectTeams(projectId: string): Promise<ServiceResponse<TeamWithMembers[]>> {
    try {
      const { data: teams, error } = await this.supabase
        .from('teams')
        .select(`
          *,
          members:team_members(
            *,
            user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
          ),
          project:projects(id, name, status)
        `)
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch project teams',
            details: error
          }
        }
      }

      const teamsWithMembers: TeamWithMembers[] = teams.map(team => ({
        ...team,
        member_count: team.members?.length || 0
      }))

      return {
        data: teamsWithMembers,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching project teams',
          details: error
        }
      }
    }
  }

  /**
   * Gets all teams for multiple projects (useful for workspace views)
   */
  async getProjectsTeams(projectIds: string[]): Promise<ServiceResponse<TeamWithMembers[]>> {
    try {
      if (projectIds.length === 0) {
        return { data: [], error: null }
      }

      const { data: teams, error } = await this.supabase
        .from('teams')
        .select(`
          *,
          members:team_members(
            *,
            user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
          ),
          project:projects(id, name, status)
        `)
        .in('project_id', projectIds)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch teams for projects',
            details: error
          }
        }
      }

      const teamsWithMembers: TeamWithMembers[] = teams.map(team => ({
        ...team,
        member_count: team.members?.length || 0
      }))

      return {
        data: teamsWithMembers,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching teams for projects',
          details: error
        }
      }
    }
  }

  /**
   * Gets all teams for a specific user
   */
  async getUserTeams(userId: string): Promise<ServiceResponse<TeamWithMembers[]>> {
    try {
      const { data: memberRecords, error } = await this.supabase
        .from('team_members')
        .select(`
          *,
          team:teams(
            *,
            members:team_members(
              *,
              user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
            )
          )
        `)
        .eq('user_id', userId)

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch user teams',
            details: error
          }
        }
      }

      const teams: TeamWithMembers[] = memberRecords
        .filter(record => record.team)
        .map(record => ({
          ...record.team,
          member_count: record.team.members?.length || 0
        }))

      return {
        data: teams,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching user teams',
          details: error
        }
      }
    }
  }

  /**
   * Updates team information
   */
  async updateTeam(teamId: string, input: UpdateTeamInput): Promise<ServiceResponse<Team>> {
    try {
      const { data, error } = await this.supabase
        .from('teams')
        .update(input)
        .eq('id', teamId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update team',
            details: error
          }
        }
      }

      return {
        data: data as Team,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'UPDATE_ERROR',
          message: 'An error occurred while updating team',
          details: error
        }
      }
    }
  }

  /**
   * Deletes a team (soft delete by setting is_active = false)
   */
  async deleteTeam(teamId: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('teams')
        .update({ is_active: false })
        .eq('id', teamId)

      if (error) {
        return {
          data: null,
          error: {
            code: 'DELETE_FAILED',
            message: 'Failed to delete team',
            details: error
          }
        }
      }

      return {
        data: null,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'DELETE_ERROR',
          message: 'An error occurred while deleting team',
          details: error
        }
      }
    }
  }

  // ========================================
  // MEMBER MANAGEMENT
  // ========================================

  /**
   * Adds a new member to a team by username
   */
  async addMember(input: AddMemberInput, invitedBy: string): Promise<ServiceResponse<TeamMember>> {
    try {
      const { team_id, username, role = 'member' } = input

      // First, get the team to verify workspace
      const { data: team, error: teamError } = await this.supabase
        .from('teams')
        .select('workspace_id')
        .eq('id', team_id)
        .single()

      if (teamError) {
        return {
          data: null,
          error: {
            code: 'TEAM_NOT_FOUND',
            message: 'Team not found',
            details: teamError
          }
        }
      }

      // Find user by username (global search - users are not workspace-specific)
      const { data: userProfile, error: userError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .ilike('username', username)
        .single()

      if (userError || !userProfile) {
        return {
          data: null,
          error: {
            code: 'USER_NOT_FOUND',
            message: `User with username "${username}" not found`
          }
        }
      }

      // Check if user is already a member
      const { data: existing } = await this.supabase
        .from('team_members')
        .select('id')
        .eq('team_id', team_id)
        .eq('user_id', userProfile.id)
        .maybeSingle()

      if (existing) {
        return {
          data: null,
          error: {
            code: 'ALREADY_MEMBER',
            message: 'User is already a member of this team'
          }
        }
      }

      // Add member
      const { data: member, error: memberError } = await this.supabase
        .from('team_members')
        .insert({
          team_id,
          user_id: userProfile.id,
          role,
          invited_by: invitedBy
        })
        .select()
        .single()

      if (memberError) {
        return {
          data: null,
          error: {
            code: 'ADD_MEMBER_FAILED',
            message: 'Failed to add member to team',
            details: memberError
          }
        }
      }

      return {
        data: member as TeamMember,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'ADD_MEMBER_ERROR',
          message: 'An error occurred while adding member',
          details: error
        }
      }
    }
  }

  /**
   * Removes a member from a team
   */
  async removeMember(teamId: string, userId: string): Promise<ServiceResponse<void>> {
    try {
      // Check if user is the team admin
      const { data: team } = await this.supabase
        .from('teams')
        .select('admin_id')
        .eq('id', teamId)
        .single()

      if (team?.admin_id === userId) {
        return {
          data: null,
          error: {
            code: 'CANNOT_REMOVE_ADMIN',
            message: 'Cannot remove team admin. Transfer admin role first or delete the team.'
          }
        }
      }

      // Remove member
      const { error } = await this.supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) {
        return {
          data: null,
          error: {
            code: 'REMOVE_MEMBER_FAILED',
            message: 'Failed to remove member from team',
            details: error
          }
        }
      }

      return {
        data: null,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'REMOVE_MEMBER_ERROR',
          message: 'An error occurred while removing member',
          details: error
        }
      }
    }
  }

  /**
   * Updates a team member's role
   */
  async updateMemberRole(teamId: string, userId: string, input: UpdateMemberInput): Promise<ServiceResponse<TeamMember>> {
    try {
      const { data, error } = await this.supabase
        .from('team_members')
        .update(input)
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'UPDATE_ROLE_FAILED',
            message: 'Failed to update member role',
            details: error
          }
        }
      }

      return {
        data: data as TeamMember,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'UPDATE_ROLE_ERROR',
          message: 'An error occurred while updating member role',
          details: error
        }
      }
    }
  }

  /**
   * Transfers team admin to another member
   */
  async transferAdmin(teamId: string, newAdminId: string): Promise<ServiceResponse<Team>> {
    try {
      // Verify new admin is a team member
      const { data: member } = await this.supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', newAdminId)
        .single()

      if (!member) {
        return {
          data: null,
          error: {
            code: 'NOT_A_MEMBER',
            message: 'New admin must be a team member'
          }
        }
      }

      // Update team admin
      const { data, error } = await this.supabase
        .from('teams')
        .update({ admin_id: newAdminId })
        .eq('id', teamId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'TRANSFER_FAILED',
            message: 'Failed to transfer admin role',
            details: error
          }
        }
      }

      // Update member roles
      await this.supabase
        .from('team_members')
        .update({ role: 'admin' })
        .eq('team_id', teamId)
        .eq('user_id', newAdminId)

      return {
        data: data as Team,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'TRANSFER_ERROR',
          message: 'An error occurred while transferring admin role',
          details: error
        }
      }
    }
  }

  // ========================================
  // TASK ASSIGNMENT
  // ========================================

  /**
   * Assigns a task to a team member
   */
  async assignTask(input: AssignTaskInput, assignedBy: string): Promise<ServiceResponse<TaskWithTeam>> {
    try {
      const { task_id, assignee_id } = input

      const { data, error } = await this.supabase
        .from('tasks')
        .update({
          assigned_to: assignee_id,
          assigned_by: assignedBy,
          assigned_at: new Date().toISOString()
        })
        .eq('id', task_id)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'ASSIGN_FAILED',
            message: 'Failed to assign task',
            details: error
          }
        }
      }

      return {
        data: data as TaskWithTeam,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'ASSIGN_ERROR',
          message: 'An error occurred while assigning task',
          details: error
        }
      }
    }
  }

  /**
   * Unassigns a task
   */
  async unassignTask(taskId: string): Promise<ServiceResponse<TaskWithTeam>> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .update({
          assigned_to: null,
          assigned_by: null,
          assigned_at: null
        })
        .eq('id', taskId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'UNASSIGN_FAILED',
            message: 'Failed to unassign task',
            details: error
          }
        }
      }

      return {
        data: data as TaskWithTeam,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'UNASSIGN_ERROR',
          message: 'An error occurred while unassigning task',
          details: error
        }
      }
    }
  }

  /**
   * Gets all tasks for a team
   */
  async getTeamTasks(teamId: string): Promise<ServiceResponse<TaskWithTeam[]>> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select(`
          *,
          team:teams(*),
          assignee:user_profiles!assigned_to(id, username, full_name, avatar_url),
          assigner:user_profiles!assigned_by(id, username, full_name, avatar_url)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_TASKS_FAILED',
            message: 'Failed to fetch team tasks',
            details: error
          }
        }
      }

      return {
        data: (data || []) as TaskWithTeam[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_TASKS_ERROR',
          message: 'An error occurred while fetching team tasks',
          details: error
        }
      }
    }
  }

  /**
   * Gets tasks assigned to a specific user
   */
  async getUserAssignedTasks(userId: string): Promise<ServiceResponse<TaskWithTeam[]>> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select(`
          *,
          team:teams(*),
          assignee:user_profiles!assigned_to(id, username, full_name, avatar_url),
          assigner:user_profiles!assigned_by(id, username, full_name, avatar_url)
        `)
        .eq('assigned_to', userId)
        .order('assigned_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_USER_TASKS_FAILED',
            message: 'Failed to fetch user tasks',
            details: error
          }
        }
      }

      return {
        data: (data || []) as TaskWithTeam[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_USER_TASKS_ERROR',
          message: 'An error occurred while fetching user tasks',
          details: error
        }
      }
    }
  }

  // ========================================
  // PERMISSION CHECKS
  // ========================================

  /**
   * Checks if a user is a team admin
   */
  async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('teams')
      .select('admin_id')
      .eq('id', teamId)
      .single()

    return data?.admin_id === userId
  }

  /**
   * Checks if a user is a team member
   */
  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle()

    return !!data
  }

  /**
   * Gets a user's role in a team
   */
  async getMemberRole(teamId: string, userId: string): Promise<ServiceResponse<TeamRole | null>> {
    try {
      const { data, error } = await this.supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_ROLE_FAILED',
            message: 'Failed to fetch member role',
            details: error
          }
        }
      }

      return {
        data: data?.role as TeamRole || null,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ROLE_ERROR',
          message: 'An error occurred while fetching member role',
          details: error
        }
      }
    }
  }

  // ========================================
  // STATISTICS & ANALYTICS
  // ========================================

  /**
   * Gets comprehensive team statistics
   */
  async getTeamStatistics(teamId: string): Promise<ServiceResponse<TeamStatistics>> {
    try {
      // Get member count
      const { data: members, error: membersError } = await this.supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)

      if (membersError) {
        return {
          data: null,
          error: {
            code: 'FETCH_STATS_FAILED',
            message: 'Failed to fetch team statistics',
            details: membersError
          }
        }
      }

      // Get task statistics
      const { data: tasks, error: tasksError } = await this.supabase
        .from('tasks')
        .select('assigned_to, completed')
        .eq('team_id', teamId)

      if (tasksError) {
        return {
          data: null,
          error: {
            code: 'FETCH_TASKS_STATS_FAILED',
            message: 'Failed to fetch task statistics',
            details: tasksError
          }
        }
      }

      const memberCount = members.length
      const taskCount = tasks?.length || 0
      const assignedTaskCount = tasks?.filter(t => t.assigned_to).length || 0
      const unassignedTaskCount = taskCount - assignedTaskCount
      const completedTaskCount = tasks?.filter(t => t.completed).length || 0
      const completionRate = taskCount > 0 ? (completedTaskCount / taskCount) * 100 : 0

      // Calculate member workloads
      const workloadMap = new Map<string, MemberWorkload>()
      
      for (const task of tasks || []) {
        if (task.assigned_to) {
          const existing = workloadMap.get(task.assigned_to) || {
            user_id: task.assigned_to,
            username: '',
            assigned_tasks: 0,
            completed_tasks: 0,
            in_progress_tasks: 0,
            overdue_tasks: 0
          }

          existing.assigned_tasks++
          if (task.completed) {
            existing.completed_tasks++
          }

          workloadMap.set(task.assigned_to, existing)
        }
      }

      const statistics: TeamStatistics = {
        team_id: teamId,
        member_count: memberCount,
        task_count: taskCount,
        assigned_task_count: assignedTaskCount,
        unassigned_task_count: unassignedTaskCount,
        completed_task_count: completedTaskCount,
        completion_rate: completionRate,
        member_workload: Array.from(workloadMap.values())
      }

      return {
        data: statistics,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'STATS_ERROR',
          message: 'An error occurred while calculating team statistics',
          details: error
        }
      }
    }
  }

  /**
   * Gets team activity logs
   */
  async getTeamActivityLogs(
    teamId: string,
    limit: number = 50
  ): Promise<ServiceResponse<TeamActivityLog[]>> {
    try {
      const { data, error } = await this.supabase
        .from('team_activity_logs')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_LOGS_FAILED',
            message: 'Failed to fetch activity logs',
            details: error
          }
        }
      }

      return {
        data: (data || []) as TeamActivityLog[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_LOGS_ERROR',
          message: 'An error occurred while fetching activity logs',
          details: error
        }
      }
    }
  }
}

// Export singleton instance
export const teamService = new TeamService()
