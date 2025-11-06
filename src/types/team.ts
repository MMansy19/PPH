// ========================================
// TEAM COLLABORATION TYPE DEFINITIONS
// PPH - Personal Process Hub
// ========================================
// This file contains all TypeScript interfaces and types
// for the team collaboration feature

// ========================================
// CORE TEAM TYPES
// ========================================

/**
 * Team entity representing a collaborative group within a workspace
 */
export interface Team {
  id: string
  workspace_id: string
  name: string
  description?: string
  admin_id: string
  avatar_url?: string
  settings: TeamSettings
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Team settings configuration
 */
export interface TeamSettings {
  max_members?: number
  allow_member_invite?: boolean
  task_assignment_rules?: 'admin_only' | 'all_members'
  visibility?: 'private' | 'workspace'
  [key: string]: any // Allow additional custom settings
}

/**
 * Team member relationship with role information
 */
export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: TeamRole
  joined_at: string
  invited_by?: string
}

/**
 * Team member role type
 */
export type TeamRole = 'admin' | 'member'

/**
 * Extended team information with member details
 */
export interface TeamWithMembers extends Team {
  members: TeamMemberWithProfile[]
  member_count: number
}

/**
 * Team member with user profile information
 */
export interface TeamMemberWithProfile extends TeamMember {
  user_profile?: UserProfile
  assigned_task_count?: number
}

/**
 * User profile with username
 */
export interface UserProfile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  company?: string
}

/**
 * Team activity log entry for audit trail
 */
export interface TeamActivityLog {
  id: string
  team_id: string
  user_id?: string
  action: TeamAction
  entity_type?: 'member' | 'task' | 'team'
  entity_id?: string
  metadata: Record<string, any>
  created_at: string
}

/**
 * Team action types for activity logging
 */
export type TeamAction =
  | 'member_added'
  | 'member_removed'
  | 'role_changed'
  | 'task_assigned'
  | 'task_unassigned'
  | 'task_reassigned'
  | 'team_created'
  | 'team_updated'
  | 'team_deleted'

// ========================================
// INPUT/OUTPUT TYPES
// ========================================

/**
 * Input for creating a new team
 */
export interface CreateTeamInput {
  workspace_id: string
  name: string
  description?: string
  settings?: Partial<TeamSettings>
}

/**
 * Input for updating a team
 */
export interface UpdateTeamInput {
  name?: string
  description?: string
  avatar_url?: string
  settings?: Partial<TeamSettings>
  is_active?: boolean
}

/**
 * Input for adding a member to a team
 */
export interface AddMemberInput {
  team_id: string
  username: string
  role?: TeamRole
}

/**
 * Input for updating a team member
 */
export interface UpdateMemberInput {
  role?: TeamRole
}

/**
 * Input for assigning a task to a team member
 */
export interface AssignTaskInput {
  task_id: string
  assignee_id: string
}

/**
 * Input for searching users by username
 */
export interface SearchUsersInput {
  query: string
  limit?: number
  exclude_team_id?: string // Exclude members of this team
}

// ========================================
// USERNAME TYPES
// ========================================

/**
 * Username availability check result
 */
export interface UsernameAvailability {
  available: boolean
  username: string
  suggestion?: string
  error?: string
}

/**
 * Username validation result
 */
export interface UsernameValidation {
  valid: boolean
  error?: string
}

/**
 * Username update input
 */
export interface UpdateUsernameInput {
  new_username: string
}

// ========================================
// TASK EXTENSION TYPES
// ========================================

/**
 * Extended task with team assignment information
 */
export interface TaskWithTeam {
  id: string
  workspace_id: string
  title: string
  description?: string
  duration: string
  priority: 'high' | 'medium' | 'low'
  entity_type: 'task' | 'event' | 'activity' | 'process'
  status: 'todo' | 'in-progress' | 'done'
  completed: boolean
  
  // Team collaboration fields
  team_id?: string
  assigned_to?: string
  assigned_by?: string
  assigned_at?: string
  
  // Related data
  team?: Team
  assignee?: UserProfile
  assigner?: UserProfile
  
  // Existing fields
  value?: number
  risk?: number
  category?: 'big_bets' | 'line_extensions' | 'ltos' | 'other'
  npv?: number
  created_at?: string
  start_date?: string
  end_date?: string
  due_date?: string
  tags?: string[]
}

// ========================================
// RESPONSE TYPES
// ========================================

/**
 * Standard service response wrapper
 */
export interface ServiceResponse<T> {
  data: T | null
  error: ServiceError | null
}

/**
 * Service error details
 */
export interface ServiceError {
  message: string
  code?: string
  details?: any
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}

// ========================================
// STATISTICS TYPES
// ========================================

/**
 * Team statistics and metrics
 */
export interface TeamStatistics {
  team_id: string
  member_count: number
  task_count: number
  assigned_task_count: number
  unassigned_task_count: number
  completed_task_count: number
  completion_rate: number
  member_workload: MemberWorkload[]
}

/**
 * Individual member workload information
 */
export interface MemberWorkload {
  user_id: string
  username: string
  full_name?: string
  assigned_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
}

// ========================================
// FILTER & SORT TYPES
// ========================================

/**
 * Team filter options
 */
export interface TeamFilter {
  workspace_id?: string
  is_active?: boolean
  search?: string
}

/**
 * Team sort options
 */
export interface TeamSort {
  field: 'name' | 'created_at' | 'member_count'
  direction: 'asc' | 'desc'
}

/**
 * Task filter options with team support
 */
export interface TaskFilter {
  workspace_id?: string
  team_id?: string
  assigned_to?: string
  status?: 'todo' | 'in-progress' | 'done'
  priority?: 'high' | 'medium' | 'low'
  has_assignee?: boolean
}

// ========================================
// PERMISSION TYPES
// ========================================

/**
 * Team permission check result
 */
export interface TeamPermission {
  can_view: boolean
  can_edit: boolean
  can_delete: boolean
  can_add_members: boolean
  can_remove_members: boolean
  can_assign_tasks: boolean
  is_admin: boolean
  is_member: boolean
  is_workspace_owner: boolean
}

// ========================================
// UTILITY TYPES
// ========================================

/**
 * Team invitation (for future email invitations)
 */
export interface TeamInvitation {
  id: string
  team_id: string
  email: string
  role: TeamRole
  invited_by: string
  expires_at: string
  accepted: boolean
  created_at: string
}

/**
 * Team template (for future team templates feature)
 */
export interface TeamTemplate {
  id: string
  name: string
  description?: string
  category: 'agile' | 'marketing' | 'engineering' | 'general'
  default_settings: TeamSettings
  default_roles: TeamRole[]
}

// ========================================
// FORM TYPES
// ========================================

/**
 * Team creation form data
 */
export interface TeamFormData {
  name: string
  description: string
  workspace_id: string
}

/**
 * Member invitation form data
 */
export interface MemberInviteFormData {
  username: string
  role: TeamRole
}

/**
 * Username update form data
 */
export interface UsernameFormData {
  username: string
}

// ========================================
// CONTEXT TYPES
// ========================================

/**
 * Team context value for React Context
 */
export interface TeamContextValue {
  currentTeam: Team | null
  teams: Team[]
  loading: boolean
  error: ServiceError | null
  selectTeam: (teamId: string) => void
  refreshTeams: () => Promise<void>
}

/**
 * Username context value for React Context
 */
export interface UsernameContextValue {
  username: string | null
  availability: 'available' | 'taken' | 'checking' | null
  checkAvailability: (username: string) => Promise<void>
  updateUsername: (username: string) => Promise<ServiceResponse<void>>
}

// ========================================
// EXPORTS
// ========================================

// Re-export for convenience
export type {
  // Core types are already exported above
}
