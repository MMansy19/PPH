'use client'

import { useState } from 'react'
import { useTeam } from '@/hooks/useTeam'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2, Users, AlertCircle } from 'lucide-react'
import type { CreateTeamInput, TeamSettings } from '@/types/team'

interface TeamCreationModalProps {
  workspaceId: string
  adminId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: (teamId: string) => void
}

/**
 * TeamCreationModal Component
 * 
 * Modal for creating a new team with:
 * - Team name and description
 * - Optional settings (max members, member permissions)
 * - Form validation
 * - Loading and error states
 */
export function TeamCreationModal({
  workspaceId,
  adminId,
  isOpen,
  onClose,
  onSuccess
}: TeamCreationModalProps) {
  const { createTeam, isLoading, error } = useTeam()

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxMembers, setMaxMembers] = useState<number | undefined>(undefined)
  const [allowMemberInvite, setAllowMemberInvite] = useState(true)
  const [taskAssignmentRules, setTaskAssignmentRules] = useState<'admin_only' | 'all_members'>('all_members')
  const [visibility, setVisibility] = useState<'private' | 'workspace'>('workspace')

  // Validation state
  const [nameError, setNameError] = useState('')

  // Validate form
  const validateForm = (): boolean => {
    setNameError('')

    if (!name.trim()) {
      setNameError('Team name is required')
      return false
    }

    if (name.trim().length < 3) {
      setNameError('Team name must be at least 3 characters')
      return false
    }

    if (name.trim().length > 50) {
      setNameError('Team name must not exceed 50 characters')
      return false
    }

    return true
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const settings: TeamSettings = {
      max_members: maxMembers,
      allow_member_invite: allowMemberInvite,
      task_assignment_rules: taskAssignmentRules,
      visibility
    }

    const input: CreateTeamInput = {
      workspace_id: workspaceId,
      name: name.trim(),
      description: description.trim() || undefined,
      settings
    }

    const team = await createTeam(input, adminId)
    
    if (team) {
      // Reset form
      setName('')
      setDescription('')
      setMaxMembers(undefined)
      setAllowMemberInvite(true)
      setTaskAssignmentRules('all_members')
      setVisibility('workspace')
      
      // Notify parent
      if (onSuccess) {
        onSuccess(team.id)
      }
      
      // Close modal
      onClose()
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setName('')
    setDescription('')
    setNameError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={handleCancel}
        />

        {/* Modal Content */}
        <div className="relative z-50 w-full max-w-lg bg-background border rounded-lg shadow-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Team</h2>
              <p className="text-sm text-muted-foreground">
                Set up a team to collaborate with others
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="team-name" className="required">
                Team Name
              </Label>
              <Input
                id="team-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setNameError('')
                }}
                placeholder="e.g., Marketing Team, Development Squad"
                disabled={isLoading}
                className={nameError ? 'border-destructive' : ''}
              />
              {nameError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {nameError}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="team-description">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="team-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this team..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Settings Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Team Settings</h3>

              {/* Max Members */}
              <div className="space-y-2">
                <Label htmlFor="max-members">
                  Maximum Members <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="max-members"
                  type="number"
                  min={2}
                  max={100}
                  value={maxMembers || ''}
                  onChange={(e) => setMaxMembers(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="No limit"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited members
                </p>
              </div>

              {/* Allow Member Invite */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="member-invite">
                    Allow members to invite others
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    When disabled, only admins can add members
                  </p>
                </div>
                <Switch
                  id="member-invite"
                  checked={allowMemberInvite}
                  onCheckedChange={setAllowMemberInvite}
                  disabled={isLoading}
                />
              </div>

              {/* Task Assignment Rules */}
              <div className="space-y-2">
                <Label htmlFor="task-assignment">
                  Task Assignment
                </Label>
                <select
                  id="task-assignment"
                  value={taskAssignmentRules}
                  onChange={(e) => setTaskAssignmentRules(e.target.value as 'admin_only' | 'all_members')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="all_members">All members can assign tasks</option>
                  <option value="admin_only">Only admins can assign tasks</option>
                </select>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label htmlFor="visibility">
                  Visibility
                </Label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'private' | 'workspace')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="workspace">Visible to workspace</option>
                  <option value="private">Private (members only)</option>
                </select>
              </div>
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
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Team'
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
