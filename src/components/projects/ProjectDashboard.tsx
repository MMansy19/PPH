'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectWithTeams, TeamWithMembers } from '@/types/team'
import { Task } from '@/types'
import { ProjectService } from '@/lib/project-service'
import { TeamService } from '@/lib/team-service'
import { tasksService } from '@/lib/tasks'
import { ProjectCard } from './ProjectCard'
import { TeamCreationModal } from '@/components/teams/TeamCreationModal'
import { TeamManagementModal } from '@/components/teams/TeamManagementModal'
import { BoardView } from '@/components/views/BoardView'
import {
  FolderOpen,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-react'

interface ProjectDashboardProps {
  project: ProjectWithTeams
  onProjectUpdate?: (project: ProjectWithTeams) => void
}

export function ProjectDashboard({ project, onProjectUpdate }: ProjectDashboardProps) {
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMembers | null>(null)

  const projectService = new ProjectService()
  const teamService = new TeamService()

  useEffect(() => {
    loadProjectData()
  }, [project.id])

  const loadProjectData = async () => {
    setIsLoading(true)
    try {
      // Load teams
      const teamsResult = await teamService.getProjectTeams(project.id)
      if (teamsResult.data) {
        setTeams(teamsResult.data)
      }

      // Load tasks
      const tasksResult = await tasksService.getTasksByProject(project.id)
      if (tasksResult.data) {
        setTasks(tasksResult.data)
      }
    } catch (error) {
      console.error('Error loading project data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTeamCreated = (teamId: string) => {
    setShowTeamModal(false)
    loadProjectData() // Refresh data
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length
  }

  const completionRate = tasks.length > 0 ? Math.round((tasksByStatus.done / tasks.length) * 100) : 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FolderOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('_', ' ')}
              </Badge>
              {project.start_date && (
                <span className="text-sm text-muted-foreground">
                  Started {new Date(project.start_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <Button onClick={() => setShowTeamModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">
              Active teams in project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasksByStatus.done} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {tasksByStatus.review} in review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Task Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
              <CardDescription>Current status of all tasks in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{tasksByStatus.todo}</div>
                  <div className="text-sm text-muted-foreground">To Do</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{tasksByStatus.inProgress}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{tasksByStatus.review}</div>
                  <div className="text-sm text-muted-foreground">Review</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{tasksByStatus.done}</div>
                  <div className="text-sm text-muted-foreground">Done</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Teams */}
          <Card>
            <CardHeader>
              <CardTitle>Project Teams</CardTitle>
              <CardDescription>Teams working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.slice(0, 5).map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {team.member_count} members
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Team
                      </Button>
                    </div>
                  ))}
                  {teams.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View All Teams ({teams.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No teams yet</p>
                  <Button onClick={() => setShowTeamModal(true)} className="mt-2">
                    Create First Team
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board">
          <Card>
            <CardHeader>
              <CardTitle>Project Kanban Board</CardTitle>
              <CardDescription>Drag and drop tasks to update their status</CardDescription>
            </CardHeader>
            <CardContent>
              <BoardView projectId={project.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>{team.description}</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTeam(team)}
                  >
                    Manage Team
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{team.member_count} members</span>
                  <span>•</span>
                  <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Trend</CardTitle>
                <CardDescription>Task completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mb-4" />
                  <p>Analytics chart will go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Tasks completed by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <Activity className="h-12 w-12 mb-4" />
                  <p>Team performance chart will go here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Team Creation Modal */}
      {showTeamModal && (
        <TeamCreationModal
          projectId={project.id}
          adminId={project.admin_id}
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          onSuccess={handleTeamCreated}
        />
      )}

      {/* Team Management Modal */}
      {selectedTeam && (
        <TeamManagementModal
          team={selectedTeam}
          workspaceId={project.workspace_id}
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onUpdate={() => {
            loadProjectData()
            setSelectedTeam(null)
          }}
        />
      )}
    </div>
  )
}