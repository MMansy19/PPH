'use client'

import { useState, useEffect, useRef } from 'react'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { usernameService } from '@/lib/username-service'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, UserPlus, AlertCircle, Search, Check } from 'lucide-react'
import type { UserProfile, TeamRole } from '@/types/team'

interface MemberInviteModalProps {
  teamId: string
  workspaceId: string
  currentUserId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * MemberInviteModal Component
 * 
 * Modal for inviting members to a team with:
 * - Username search with autocomplete
 * - Role selection (admin or member)
 * - Loading and error states
 * - Duplicate prevention
 */
export function MemberInviteModal({
  teamId,
  workspaceId,
  currentUserId,
  isOpen,
  onClose,
  onSuccess
}: MemberInviteModalProps) {
  const { addMember, isLoading, error } = useTeamMembers(teamId)

  // Form state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<TeamRole>('member')

  // Search state
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Refs
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSelectedUser(null)
    setShowDropdown(true)

    // Clear previous timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    // Debounce search
    if (value.trim().length >= 2) {
      setIsSearching(true)
      searchTimerRef.current = setTimeout(async () => {
        try {
          const response = await usernameService.searchUsersByUsername(
            value.trim(),
            workspaceId,
            5
          )
          if (response.data) {
            setSearchResults(response.data)
          }
        } catch (err) {
          console.error('Search error:', err)
        } finally {
          setIsSearching(false)
        }
      }, 300)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  // Handle user selection
  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user)
    setSearchQuery(user.username)
    setShowDropdown(false)
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) {
      return
    }

    const member = await addMember(selectedUser.username, currentUserId, role)
    
    if (member) {
      // Reset form
      setSearchQuery('')
      setSelectedUser(null)
      setRole('member')
      setSearchResults([])
      
      // Notify parent
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal
      onClose()
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setSearchQuery('')
    setSelectedUser(null)
    setRole('member')
    setSearchResults([])
    setShowDropdown(false)
    onClose()
  }

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={handleCancel}
        />

        {/* Modal Content */}
        <div className="relative z-50 w-full max-w-md bg-background border rounded-lg shadow-lg p-6 m-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Invite Member</h2>
              <p className="text-sm text-muted-foreground">
                Add a member to your team
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Search */}
            <div className="space-y-2" ref={dropdownRef}>
              <Label htmlFor="username-search">
                Search by Username
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Type username to search..."
                  disabled={isLoading}
                  className="pl-9"
                  autoComplete="off"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {selectedUser && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.username}</p>
                        {user.full_name && (
                          <p className="text-sm text-muted-foreground truncate">
                            {user.full_name}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showDropdown && !isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
                  No users found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            {/* Selected User Display */}
            {selectedUser && (
              <div className="p-3 bg-accent rounded-md flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {selectedUser.username[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedUser.username}</p>
                  {selectedUser.full_name && (
                    <p className="text-sm text-muted-foreground truncate">
                      {selectedUser.full_name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role
              </Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as TeamRole)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {role === 'admin' 
                  ? 'Admins can manage team settings and members' 
                  : 'Members can view and collaborate on tasks'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button
                type="submit"
                disabled={!selectedUser || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Member'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  )
}
