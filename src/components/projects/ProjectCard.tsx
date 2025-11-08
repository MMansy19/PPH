'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProjectWithTeams, ProjectStatus } from '@/types/team'
import { ProjectService } from '@/lib/project-service'
import {
  FolderOpen,
  Users,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Edit3,
  Archive,
  Trash2,
  Play,
  Pause,
  BarChart3
} from 'lucide-react'

interface ProjectCardProps {
  project: ProjectWithTeams
  onProjectClick?: (project: ProjectWithTeams) => void
  onProjectUpdate?: (project: ProjectWithTeams) => void
  onProjectDelete?: (projectId: string) => void
  showActions?: boolean
  compact?: boolean
}

export function ProjectCard({
  project,
  onProjectClick,
  onProjectUpdate,
  onProjectDelete,
  showActions = true,
  compact = false
}: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const projectService = new ProjectService()

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'planning':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />
      case 'planning':
        return <Calendar className="h-3 w-3" />
      case 'on_hold':
        return <Pause className="h-3 w-3" />
      case 'completed':
        return <CheckCircle2 className="h-3 w-3" />
      case 'cancelled':
        return <Archive className="h-3 w-3" />
      default:
        return <FolderOpen className="h-3 w-3" />
    }
  }

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    setIsLoading(true)
    try {
      const result = await projectService.updateProjectStatus(project.id, newStatus)
      if (result.data) {
        onProjectUpdate?.(result.data as ProjectWithTeams)
      } else if (result.error) {
        console.error('Failed to update project status:', result.error)
      }
    } catch (error) {
      console.error('Error updating project status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async () => {
    setIsLoading(true)
    try {
      const result = await projectService.updateProject(project.id, { is_active: false })
      if (result.data) {
        onProjectUpdate?.(result.data as ProjectWithTeams)
      } else if (result.error) {
        console.error('Failed to archive project:', result.error)
      }
    } catch (error) {
      console.error('Error archiving project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      setIsLoading(true)
      try {
        const result = await projectService.deleteProject(project.id)
        if (!result.error) {
          onProjectDelete?.(project.id)
        } else {
          console.error('Failed to delete project:', result.error)
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        onProjectClick ? 'cursor-pointer hover:bg-gray-50' : ''
      } ${compact ? 'p-3' : ''}`}
      onClick={() => onProjectClick?.(project)}
    >
      <CardHeader className={`${compact ? 'pb-2' : 'pb-3'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-1">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} truncate`}>
                {project.name}
              </CardTitle>
              {project.description && (
                <CardDescription className={`${compact ? 'text-sm' : ''} line-clamp-2 mt-1`}>
                  {project.description}
                </CardDescription>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor(project.status)} flex items-center gap-1`}
            >
              {getStatusIcon(project.status)}
              {project.status.replace('_', ' ')}
            </Badge>
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isLoading}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* TODO: Open edit modal */ }}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {project.status !== 'active' && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange('active') }}>
                      <Play className="h-4 w-4 mr-2" />
                      Mark Active
                    </DropdownMenuItem>
                  )}
                  
                  {project.status !== 'on_hold' && project.status !== 'completed' && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange('on_hold') }}>
                      <Pause className="h-4 w-4 mr-2" />
                      Put On Hold
                    </DropdownMenuItem>
                  )}
                  
                  {project.status !== 'completed' && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange('completed') }}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleArchive() }}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleDelete() }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={`${compact ? 'pt-0' : ''}`}>
        <div className="space-y-4">
          {/* Progress Bar */}
          {project.task_count > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress_percentage}%</span>
              </div>
              <Progress value={project.progress_percentage} className="h-2" />
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">{project.team_count}</span>
              </div>
              <p className="text-xs text-muted-foreground">Teams</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">{project.task_count}</span>
              </div>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">{project.completed_task_count}</span>
              </div>
              <p className="text-xs text-muted-foreground">Done</p>
            </div>
          </div>

          {/* Dates */}
          {(project.start_date || project.end_date) && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              {project.start_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Started {formatDate(project.start_date)}</span>
                </div>
              )}
              {project.end_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(project.end_date)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}