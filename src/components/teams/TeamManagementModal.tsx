'use client'

import { useState, useEffect } from 'react'
import { X, UserPlus, Edit2, Trash2, Users, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { teamService } from '@/lib/team-service'
import { MemberInviteModal } from './MemberInviteModal'
import type { TeamWithMembers } from '@/types/team'

interface TeamManagementModalProps {
  team: TeamWithMembers
  workspaceId: string
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function TeamManagementModal({ team, workspaceId, isOpen, onClose, onUpdate }: TeamManagementModalProps) {
  const { success, error: showError } = useToast()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description || '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: team.name,
        description: team.description || '',
      })
      setIsEditing(false)
      setIsDeleting(false)
    }
  }, [isOpen, team])

  if (!isOpen) return null

  const handleUpdateTeam = async () => {
    if (!formData.name.trim()) {
      showError('Team name is required')
      return
    }

    setLoading(true)
    try {
      const result = await teamService.updateTeam(team.id, formData)

      if (result.error) {
        showError(result.error.message || 'Failed to update team')
        return
      }

      success('Team updated successfully')
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      showError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeam = async () => {
    setLoading(true)
    try {
      const result = await teamService.deleteTeam(team.id)

      if (result.error) {
        showError(result.error.message || 'Failed to delete team')
        return
      }

      success('Team deleted successfully')
      onUpdate()
      onClose()
    } catch (error) {
      showError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberUserId: string) => {
    setLoading(true)
    try {
      const result = await teamService.removeMember(team.id, memberUserId)

      if (result.error) {
        showError(result.error.message || 'Failed to remove member')
        return
      }

      success('Member removed successfully')
      onUpdate()
    } catch (error) {
      showError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMemberRole = async (memberUserId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin'
    
    setLoading(true)
    try {
      const result = await teamService.updateMemberRole(team.id, memberUserId, { role: newRole })

      if (result.error) {
        showError(result.error.message || 'Failed to update member role')
        return
      }

      success(`Member role updated to ${newRole}`)
      onUpdate()
    } catch (error) {
      showError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-background rounded-lg shadow-lg border">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{team.name}</h2>
              <p className="text-sm text-muted-foreground">{team.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Delete Confirmation */}
          {isDeleting ? (
            <div className="space-y-4 p-6 bg-destructive/10 rounded-lg border border-destructive">
              <h3 className="text-lg font-semibold text-destructive">Delete Team?</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete the team and remove all members.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={handleDeleteTeam}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete Team'}
                </Button>
                <Button variant="outline" onClick={() => setIsDeleting(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            /* Edit Form */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter team description"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleUpdateTeam} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Team Management View */
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={() => setShowInviteModal(true)} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Members
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Team
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleting(true)}
                  className="gap-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Team
                </Button>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members ({team.members?.length || 0})
                </h3>
                <div className="space-y-2">
                  {team.members && team.members.length > 0 ? (
                    team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {member.user_profile?.avatar_url ? (
                              <img
                                src={member.user_profile.avatar_url}
                                alt={member.user_profile.full_name || 'User'}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.user_profile?.full_name || member.user_profile?.username || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user_profile?.company || 'No company'}
                            </p>
                          </div>
                          {member.role === 'admin' && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                              <Shield className="h-3 w-3" />
                              Admin
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateMemberRole(member.user_id, member.role)}
                            disabled={loading}
                          >
                            {member.role === 'admin' ? 'Make Member' : 'Make Admin'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.user_id)}
                            disabled={loading}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No team members yet</p>
                      <p className="text-sm">Click "Add Members" to invite people</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Invite Modal */}
      {showInviteModal && user && (
        <MemberInviteModal
          teamId={team.id}
          workspaceId={workspaceId}
          currentUserId={user.id}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false)
            onUpdate()
          }}
        />
      )}
    </>
  )
}
