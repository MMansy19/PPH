import { createClient } from '@/lib/supabase'
import type {
  ServiceResponse,
  UsernameAvailability,
  UsernameValidation,
  UpdateUsernameInput,
  UserProfile
} from '@/types/team'

/**
 * Username Service
 * 
 * Provides username validation, availability checking, and update functionality.
 * Usernames are unique across the entire platform and case-insensitive.
 */
export class UsernameService {
  private supabase = createClient()
  
  /**
   * Helper to generate username suggestion
   */
  private generateUsernameSuggestion(username: string): string {
    const baseUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (baseUsername.length >= 3) {
      const randomNum = Math.floor(Math.random() * 9999)
      return `${baseUsername}${randomNum}`
    }
    return `user${Math.floor(Math.random() * 99999)}`
  }

  /**
   * Validates username format according to business rules:
   * - 3-30 characters
   * - alphanumeric, hyphens, underscores only
   * - must start with letter or number
   * - cannot end with hyphen or underscore
   * - no consecutive special characters
   */
  validateUsername(username: string): UsernameValidation {
    // Length check
    if (username.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters long' }
    }
    if (username.length > 30) {
      return { valid: false, error: 'Username must not exceed 30 characters' }
    }

    // Character validation
    const validPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/
    if (username.length === 1) {
      // Single character usernames must be alphanumeric
      if (!/^[a-zA-Z0-9]$/.test(username)) {
        return { valid: false, error: 'Single character username must be a letter or number' }
      }
    } else if (!validPattern.test(username)) {
      if (!/^[a-zA-Z0-9]/.test(username)) {
        return { valid: false, error: 'Username must start with a letter or number' }
      }
      if (!/[a-zA-Z0-9]$/.test(username)) {
        return { valid: false, error: 'Username must end with a letter or number' }
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' }
      }
    }

    // Check for consecutive special characters
    if (/[_-]{2,}/.test(username)) {
      return { valid: false, error: 'Username cannot contain consecutive hyphens or underscores' }
    }

    // Reserved usernames
    const reserved = [
      'admin', 'administrator', 'root', 'system', 'support',
      'api', 'www', 'mail', 'ftp', 'localhost', 'test',
      'user', 'guest', 'public', 'private', 'null', 'undefined'
    ]
    if (reserved.includes(username.toLowerCase())) {
      return { valid: false, error: 'This username is reserved and cannot be used' }
    }

    return { valid: true }
  }

  /**
   * Checks if a username is available (not taken by another user)
   * Case-insensitive check
   */
  async checkAvailability(username: string, excludeUserId?: string): Promise<ServiceResponse<UsernameAvailability>> {
    try {
      // First validate format
      const validation = this.validateUsername(username)
      if (!validation.valid) {
        return {
          data: {
            available: false,
            username,
            error: validation.error,
            suggestion: this.generateUsernameSuggestion(username)
          },
          error: null
        }
      }

      // Check if username exists (case-insensitive)
      let query = this.supabase
        .from('user_profiles')
        .select('id, username')
        .ilike('username', username)

      if (excludeUserId) {
        query = query.neq('id', excludeUserId)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        return {
          data: null,
          error: {
            code: 'AVAILABILITY_CHECK_FAILED',
            message: 'Failed to check username availability',
            details: error
          }
        }
      }

      const available = !data

      return {
        data: {
          available,
          username,
          error: available ? undefined : 'Username is already taken',
          suggestion: available ? undefined : this.generateUsernameSuggestion(username)
        },
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'AVAILABILITY_CHECK_ERROR',
          message: 'An error occurred while checking username availability',
          details: error
        }
      }
    }
  }

  /**
   * Updates the username for a user
   * Performs validation and availability checks before updating
   */
  async updateUsername(userId: string, input: UpdateUsernameInput): Promise<ServiceResponse<UserProfile>> {
    try {
      const { new_username } = input

      // Validate username format
      const validation = this.validateUsername(new_username)
      if (!validation.valid) {
        return {
          data: null,
          error: {
            code: 'INVALID_USERNAME',
            message: validation.error || 'Invalid username format'
          }
        }
      }

      // Check availability (excluding current user)
      const availabilityResponse = await this.checkAvailability(new_username, userId)
      if (availabilityResponse.error) {
        return {
          data: null,
          error: availabilityResponse.error
        }
      }

      if (!availabilityResponse.data?.available) {
        return {
          data: null,
          error: {
            code: 'USERNAME_TAKEN',
            message: 'Username is already taken',
            details: availabilityResponse.data?.suggestion
          }
        }
      }

      // Update username in database
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({ username: new_username })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update username',
            details: error
          }
        }
      }

      return {
        data: data as UserProfile,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'UPDATE_ERROR',
          message: 'An error occurred while updating username',
          details: error
        }
      }
    }
  }

  /**
   * Searches for users by username with autocomplete support
   * Case-insensitive prefix matching
   */
  async searchUsersByUsername(
    query: string,
    workspaceId: string,
    limit: number = 10
  ): Promise<ServiceResponse<UserProfile[]>> {
    try {
      if (query.length < 2) {
        return {
          data: [],
          error: null
        }
      }

      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('workspace_id', workspaceId)
        .ilike('username', `${query}%`)
        .limit(limit)
        .order('username')

      if (error) {
        return {
          data: null,
          error: {
            code: 'SEARCH_FAILED',
            message: 'Failed to search users',
            details: error
          }
        }
      }

      return {
        data: (data || []) as UserProfile[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'SEARCH_ERROR',
          message: 'An error occurred while searching users',
          details: error
        }
      }
    }
  }

  /**
   * Gets a user profile by username
   * Case-insensitive lookup
   */
  async getUserByUsername(username: string, workspaceId: string): Promise<ServiceResponse<UserProfile | null>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('workspace_id', workspaceId)
        .ilike('username', username)
        .maybeSingle()

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_FAILED',
            message: 'Failed to fetch user profile',
            details: error
          }
        }
      }

      return {
        data: data as UserProfile | null,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'An error occurred while fetching user profile',
          details: error
        }
      }
    }
  }
}

// Export singleton instance
export const usernameService = new UsernameService()
