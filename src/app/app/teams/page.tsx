'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useTeam } from '@/hooks/useTeam'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { TeamCreationModal } from '@/components/teams/TeamCreationModal'
import { MemberInviteModal } from '@/components/teams/MemberInviteModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Settings, 
  MoreVertical, 
  UserPlus,
  Crown,
  Calendar,
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import type { TeamWithMembers } from '@/types/team'

export default function TeamsPage() {
  const { user, loading: authLoading } = useRequireAuth('/auth/login')
  const { teams, loadUserTeams, createTeam, isLoading, error } = useTeam()
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMembers | null>(null)
  
  // View state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  // Load user's teams on mount
  useEffect(() => {
    if (user) {
      loadUserTeams(user.id)
    }
  }, [user, loadUserTeams])

  // Handle team creation success
  const handleTeamCreated = (teamId: string) => {
    setShowCreateModal(false)
    // Refresh teams list
    if (user) {
      loadUserTeams(user.id)
    }
  }

  // Handle member invite success
  const handleMemberInvited = () => {
    setShowInviteModal(false)
    setSelectedTeam(null)
    // Refresh teams list
    if (user) {
      loadUserTeams(user.id)
    }
  }

  // Get user's role in team
  const getUserRole = (team: TeamWithMembers) => {
    if (team.admin_id === user?.id) return 'admin'
    const member = team.members?.find(m => m.user_id === user?.id)
    return member?.role || 'member'
  }

  // Check if user can manage team
  const canManageTeam = (team: TeamWithMembers) => {
    return team.admin_id === user?.id || getUserRole(team) === 'admin'
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-responsive safe-area-inset">
      <div className="container-responsive max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
          <Button variant="ghost" size="sm" asChild className="mb-3 sm:mb-4 touch-target">
            <Link href="/app" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm sm:text-base">Back to Dashboard</span>
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teams
              </h1>
              <p className="text-responsive text-gray-600 mt-1 sm:mt-2">
                Collaborate with your team members on projects and tasks
              </p>
            </div>
            
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto touch-target"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && teams.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first team to start collaborating with others on projects and tasks.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Teams Grid */}
        {!isLoading && teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => {
              const userRole = getUserRole(team)
              const isAdmin = canManageTeam(team)
              
              return (
                <Card key={team.id} className="card-responsive hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg truncate">{team.name}</CardTitle>
                          {isAdmin && (
                            <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        {team.description && (
                          <CardDescription className="text-sm line-clamp-2 mb-3">
                            {team.description}
                          </CardDescription>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{team.member_count} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(team.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {userRole}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 pt-0">
                    {/* Team Members Preview */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Members</span>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTeam(team)
                              setShowInviteModal(true)
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Invite
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex -space-x-2">
                        {team.members?.slice(0, 5).map((member) => (
                          <div
                            key={member.id}
                            className="relative h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                            title={member.user_profile?.username || 'Unknown'}
                          >
                            <span className="text-xs font-medium text-gray-600">
                              {member.user_profile?.username?.[0]?.toUpperCase() || '?'}
                            </span>
                            {member.role === 'admin' && (
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full border border-white">
                                <Crown className="h-2 w-2 text-white m-0.5" />
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {team.member_count > 5 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">
                              +{team.member_count - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Team Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-sm font-semibold text-gray-900">24</div>
                        <div className="text-xs text-gray-500">Tasks</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-semibold text-green-700">18</div>
                        <div className="text-xs text-green-600">Done</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-sm font-semibold text-blue-700">6</div>
                        <div className="text-xs text-blue-600">Active</div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-2"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Team Statistics Summary */}
        {!isLoading && teams.length > 0 && (
          <Card className="mt-6 sm:mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overview
              </CardTitle>
              <CardDescription>
                Your team collaboration summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{teams.length}</div>
                  <div className="text-sm text-blue-600">Teams</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {teams.reduce((acc, team) => acc + team.member_count, 0)}
                  </div>
                  <div className="text-sm text-green-600">Total Members</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    {teams.filter(team => canManageTeam(team)).length}
                  </div>
                  <div className="text-sm text-purple-600">Admin Teams</div>
                </div>
                
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">84</div>
                  <div className="text-sm text-amber-600">Total Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <TeamCreationModal
          workspaceId="default-workspace" // Replace with actual workspace ID
          adminId={user.id}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTeamCreated}
        />
      )}

      {showInviteModal && selectedTeam && (
        <MemberInviteModal
          teamId={selectedTeam.id}
          workspaceId={selectedTeam.workspace_id}
          currentUserId={user.id}
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false)
            setSelectedTeam(null)
          }}
          onSuccess={handleMemberInvited}
        />
      )}
    </div>
  )
}