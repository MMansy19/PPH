import { createClient } from '@/lib/supabase'
import type {
  ServiceResponse,
  Project,
  ProjectWithTeams,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
  TeamWithMembers
} from '@/types/team'

/**
 * Helper function to handle user profile queries with fallbacks
 */
async function queryWithUserProfileFallback(
  supabase: any,
  table: string,
  selectQuery: string,
  filters: any = {}
): Promise<{ data: any[] | null; error: any }> {
  try {
    // First try with user_profiles
    const query = supabase.from(table).select(selectQuery)
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key.includes('.')) {
        // Handle nested filters like 'eq.workspace_id'
        const [method, field] = key.split('.')
        query[method](field, value)
      } else {
        query.eq(key, value)
      }
    })

    const { data: initialData, error: initialError } = await query

    if (initialError && initialError.code === 'PGRST200') {
      // Try with users_view fallback
      const fallbackQuery = selectQuery.replace(/user_profiles/g, 'users_view')
      const fallbackQueryBuilder = supabase.from(table).select(fallbackQuery)
      
      Object.entries(filters).forEach(([key, value]) => {
        if (key.includes('.')) {
          const [method, field] = key.split('.')
          fallbackQueryBuilder[method](field, value)
        } else {
          fallbackQueryBuilder.eq(key, value)
        }
      })

      const { data: fallbackData, error: fallbackError } = await fallbackQueryBuilder
      
      if (fallbackError) {
        return { data: null, error: fallbackError }
      }
      return { data: fallbackData, error: null }
    } else if (initialError) {
      return { data: null, error: initialError }
    }

    return { data: initialData, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Project Service
 * 
 * Provides comprehensive project management functionality including:
 * - Project CRUD operations
 * - Team assignment to projects
 * - Project statistics and analytics
 * - Permission checks
 */
export class ProjectService {
  private supabase = createClient()

  // ========================================
  // PROJECT CRUD OPERATIONS
  // ========================================

  /**
   * Creates a new project within a workspace
   * The current user becomes the project admin automatically
   */
  async createProject(input: CreateProjectInput, adminId: string): Promise<ServiceResponse<Project>> {
    try {
      const { workspace_id, name, description, start_date, end_date, budget, settings } = input

      // Insert project
      const { data: project, error } = await this.supabase
        .from('projects')
        .insert({
          workspace_id,
          name,
          description,
          admin_id: adminId,
          start_date,
          end_date,
          budget,
          status: 'planning',
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
            message: 'Failed to create project',
            details: error
          }
        }
      }

      return {
        data: project as Project,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'CREATE_ERROR',
          message: 'An error occurred while creating project',
          details: error
        }
      }
    }
  }

  /**
   * Gets a single project by ID with team information
   */
  async getProject(projectId: string): Promise<ServiceResponse<ProjectWithTeams>> {
    try {
      // Get project basic info
      const { data: project, error: projectError } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (projectError) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch project',
            details: projectError
          }
        }
      }

      // Get project teams with members
      let teams: any[] = []
      let teamsError: any = null

      try {
        // First try with the full join
        const { data: teamsData, error: initialError } = await this.supabase
          .from('teams')
          .select(`
            *,
            members:team_members(
              *,
              user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
            )
          `)
          .eq('project_id', projectId)
          .eq('is_active', true)
          .order('created_at')

        if (initialError && initialError.code === 'PGRST200') {
          // Fallback: Try with users_view if user_profiles relationship fails
          const { data: fallbackTeamsData, error: fallbackError } = await this.supabase
            .from('teams')
            .select(`
              *,
              members:team_members(
                *,
                user_profile:users_view(id, username, full_name, avatar_url, company)
              )
            `)
            .eq('project_id', projectId)
            .eq('is_active', true)
            .order('created_at')

          if (fallbackError) {
            // Final fallback: Get teams and members separately
            const { data: basicTeamsData, error: basicTeamsError } = await this.supabase
              .from('teams')
              .select('*')
              .eq('project_id', projectId)
              .eq('is_active', true)
              .order('created_at')

            if (basicTeamsError) {
              teamsError = basicTeamsError
            } else {
              teams = basicTeamsData || []
              // Get members separately for each team
              for (const team of teams) {
                const { data: membersData } = await this.supabase
                  .from('team_members')
                  .select(`
                    *,
                    user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
                  `)
                  .eq('team_id', team.id)

                team.members = membersData || []
              }
            }
          } else {
            teams = fallbackTeamsData || []
          }
        } else if (initialError) {
          teamsError = initialError
        } else {
          teams = teamsData || []
        }
      } catch (error) {
        teamsError = error
      }

      if (teamsError) {
        return {
          data: null,
          error: {
            code: 'FETCH_TEAMS_FAILED',
            message: 'Failed to fetch project teams',
            details: teamsError
          }
        }
      }

      // Get project task counts
      const { data: taskStats, error: taskStatsError } = await this.supabase
        .from('tasks')
        .select('completed')
        .eq('project_id', projectId)

      if (taskStatsError) {
        console.warn('Failed to fetch task statistics:', taskStatsError)
      }

      const teamsWithMembers: TeamWithMembers[] = (teams || []).map(team => ({
        ...team,
        member_count: team.members?.length || 0
      }))

      const taskCount = taskStats?.length || 0
      const completedTaskCount = taskStats?.filter(t => t.completed).length || 0
      const progressPercentage = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0

      const projectWithTeams: ProjectWithTeams = {
        ...project as Project,
        teams: teamsWithMembers,
        team_count: teamsWithMembers.length,
        task_count: taskCount,
        completed_task_count: completedTaskCount,
        progress_percentage: progressPercentage
      }

      return {
        data: projectWithTeams,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching project',
          details: error
        }
      }
    }
  }

  /**
   * Gets all projects for a workspace
   */
  async getWorkspaceProjects(workspaceId: string): Promise<ServiceResponse<ProjectWithTeams[]>> {
    try {
      let projects: any[] = []
      let error: any = null

      try {
        // First try with the full join
        const { data: projectsData, error: initialError } = await this.supabase
          .from('projects')
          .select(`
            *,
            teams:teams(
              *,
              members:team_members(
                *,
                user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
              )
            )
          `)
          .eq('workspace_id', workspaceId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (initialError && initialError.code === 'PGRST200') {
          // Fallback: Try with users_view if user_profiles relationship fails
          const { data: fallbackProjectsData, error: fallbackError } = await this.supabase
            .from('projects')
            .select(`
              *,
              teams:teams(
                *,
                members:team_members(
                  *,
                  user_profile:users_view(id, username, full_name, avatar_url, company)
                )
              )
            `)
            .eq('workspace_id', workspaceId)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (fallbackError) {
            // Final fallback: Get projects and teams separately
            const { data: basicProjectsData, error: basicProjectsError } = await this.supabase
              .from('projects')
              .select('*')
              .eq('workspace_id', workspaceId)
              .eq('is_active', true)
              .order('created_at', { ascending: false })

            if (basicProjectsError) {
              error = basicProjectsError
            } else {
              projects = basicProjectsData || []
              // Get teams separately for each project
              for (const project of projects) {
                const { data: teamsData } = await this.supabase
                  .from('teams')
                  .select(`
                    *,
                    members:team_members(
                      *,
                      user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
                    )
                  `)
                  .eq('project_id', project.id)
                  .eq('is_active', true)

                project.teams = teamsData || []
              }
            }
          } else {
            projects = fallbackProjectsData || []
          }
        } else if (initialError) {
          error = initialError
        } else {
          projects = projectsData || []
        }
      } catch (fetchError) {
        error = fetchError
      }

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch workspace projects',
            details: error
          }
        }
      }

      // Get task statistics for all projects
      const projectIds = projects.map(p => p.id)
      let taskStats: any[] = []
      
      if (projectIds.length > 0) {
        const { data: tasks } = await this.supabase
          .from('tasks')
          .select('project_id, completed')
          .in('project_id', projectIds)
        
        taskStats = tasks || []
      }

      const projectsWithTeams: ProjectWithTeams[] = projects.map(project => {
        const teamsWithMembers: TeamWithMembers[] = (project.teams || []).map((team: any) => ({
          ...team,
          member_count: team.members?.length || 0
        }))

        const projectTasks = taskStats.filter(t => t.project_id === project.id)
        const taskCount = projectTasks.length
        const completedTaskCount = projectTasks.filter(t => t.completed).length
        const progressPercentage = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0

        return {
          ...project,
          teams: teamsWithMembers,
          team_count: teamsWithMembers.length,
          task_count: taskCount,
          completed_task_count: completedTaskCount,
          progress_percentage: progressPercentage
        }
      })

      return {
        data: projectsWithTeams,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching workspace projects',
          details: error
        }
      }
    }
  }

  /**
   * Gets all projects for a specific user (where they're admin or team member)
   */
  async getUserProjects(userId: string): Promise<ServiceResponse<ProjectWithTeams[]>> {
    try {
      // Get projects where user is admin
      const { data: adminProjects, error: adminError } = await this.supabase
        .from('projects')
        .select('*')
        .eq('admin_id', userId)
        .eq('is_active', true)

      if (adminError) {
        return {
          data: null,
          error: {
            code: 'FETCH_ADMIN_PROJECTS_FAILED',
            message: 'Failed to fetch admin projects',
            details: adminError
          }
        }
      }

      // Get projects where user is team member
      const { data: memberProjects, error: memberError } = await this.supabase
        .from('team_members')
        .select(`
          team:teams(
            project:projects(*)
          )
        `)
        .eq('user_id', userId)

      if (memberError) {
        return {
          data: null,
          error: {
            code: 'FETCH_MEMBER_PROJECTS_FAILED',
            message: 'Failed to fetch member projects',
            details: memberError
          }
        }
      }

      // Combine and deduplicate projects
      const allProjectIds = new Set([
        ...adminProjects.map(p => p.id),
        ...memberProjects
          .map((m: any) => m.team?.project?.id)
          .filter(Boolean)
      ])

      if (allProjectIds.size === 0) {
        return {
          data: [],
          error: null
        }
      }

      // Fetch full project details with teams
      const { data: projects, error: projectsError } = await this.supabase
        .from('projects')
        .select(`
          *,
          teams:teams(
            *,
            members:team_members(
              *,
              user_profile:user_profiles!team_members_user_id_fkey(id, username, full_name, avatar_url, company)
            )
          )
        `)
        .in('id', Array.from(allProjectIds))
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (projectsError) {
        return {
          data: null,
          error: {
            code: 'FETCH_PROJECTS_FAILED',
            message: 'Failed to fetch user projects',
            details: projectsError
          }
        }
      }

      // Transform to ProjectWithTeams format
      const projectsWithTeams: ProjectWithTeams[] = projects.map(project => {
        const teamsWithMembers: TeamWithMembers[] = (project.teams || []).map((team: any) => ({
          ...team,
          member_count: team.members?.length || 0
        }))

        return {
          ...project,
          teams: teamsWithMembers,
          team_count: teamsWithMembers.length,
          task_count: 0,  // Will be populated separately if needed
          completed_task_count: 0,
          progress_percentage: 0
        }
      })

      return {
        data: projectsWithTeams,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching user projects',
          details: error
        }
      }
    }
  }

  /**
   * Updates project information
   */
  async updateProject(projectId: string, input: UpdateProjectInput): Promise<ServiceResponse<Project>> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .update(input)
        .eq('id', projectId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update project',
            details: error
          }
        }
      }

      return {
        data: data as Project,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'UPDATE_ERROR',
          message: 'An error occurred while updating project',
          details: error
        }
      }
    }
  }

  /**
   * Deletes a project (soft delete by setting is_active = false)
   */
  async deleteProject(projectId: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('projects')
        .update({ is_active: false })
        .eq('id', projectId)

      if (error) {
        return {
          data: null,
          error: {
            code: 'DELETE_FAILED',
            message: 'Failed to delete project',
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
          message: 'An error occurred while deleting project',
          details: error
        }
      }
    }
  }

  /**
   * Updates project status
   */
  async updateProjectStatus(projectId: string, status: ProjectStatus): Promise<ServiceResponse<Project>> {
    try {
      const updateData: any = { status }
      
      // Auto-set completion date when marking as completed
      if (status === 'completed') {
        updateData.end_date = new Date().toISOString()
      }

      const { data, error } = await this.supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'STATUS_UPDATE_FAILED',
            message: 'Failed to update project status',
            details: error
          }
        }
      }

      return {
        data: data as Project,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'STATUS_UPDATE_ERROR',
          message: 'An error occurred while updating project status',
          details: error
        }
      }
    }
  }

  // ========================================
  // PERMISSION CHECKS
  // ========================================

  /**
   * Checks if a user is a project admin
   */
  async isProjectAdmin(projectId: string, userId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('projects')
      .select('admin_id')
      .eq('id', projectId)
      .single()

    return data?.admin_id === userId
  }

  /**
   * Checks if a user has access to a project (admin or team member)
   */
  async hasProjectAccess(projectId: string, userId: string): Promise<boolean> {
    // Check if user is project admin
    if (await this.isProjectAdmin(projectId, userId)) {
      return true
    }

    // Check if user is member of any team in the project
    const { data } = await this.supabase
      .from('team_members')
      .select(`
        team:teams(project_id)
      `)
      .eq('user_id', userId)

    if (!data) return false

    return data.some((member: any) => member.team?.project_id === projectId)
  }

  /**
   * Gets user's role in a project
   */
  async getUserProjectRole(projectId: string, userId: string): Promise<'admin' | 'member' | null> {
    if (await this.isProjectAdmin(projectId, userId)) {
      return 'admin'
    }

    if (await this.hasProjectAccess(projectId, userId)) {
      return 'member'
    }

    return null
  }
}

// Export singleton instance
export const projectService = new ProjectService()