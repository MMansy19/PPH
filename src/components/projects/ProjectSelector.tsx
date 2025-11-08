'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ProjectService } from '@/lib/project-service'
import { Project, ProjectWithTeams } from '@/types/team'
import { ProjectCreationModal } from './ProjectCreationModal'
import { Plus, FolderOpen, Users, CheckCircle } from 'lucide-react'

interface ProjectSelectorProps {
  workspaceId: string
  selectedProjectId?: string
  onProjectSelect: (project: Project | ProjectWithTeams | null) => void
  showCreateButton?: boolean
  placeholder?: string
  className?: string
}

export function ProjectSelector({
  workspaceId,
  selectedProjectId,
  onProjectSelect,
  showCreateButton = true,
  placeholder = "Select a project...",
  className
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<ProjectWithTeams[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectWithTeams | null>(null)

  const projectService = new ProjectService()

  useEffect(() => {
    loadProjects()
  }, [workspaceId])

  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === selectedProjectId)
      if (project) {
        setSelectedProject(project)
        onProjectSelect(project)
      }
    }
  }, [selectedProjectId, projects, onProjectSelect])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const result = await projectService.getWorkspaceProjects(workspaceId)
      if (result.data) {
        setProjects(result.data)
      } else if (result.error) {
        console.error('Failed to load projects:', result.error)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectSelect = (projectId: string) => {
    if (projectId === 'create-new') {
      return // Handle by modal
    }

    const project = projects.find(p => p.id === projectId)
    setSelectedProject(project || null)
    onProjectSelect(project || null)
  }

  const handleProjectCreated = (newProject: Project) => {
    // Reload projects to get the full ProjectWithTeams data
    loadProjects()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600'
      case 'planning':
        return 'text-blue-600'
      case 'on_hold':
        return 'text-yellow-600'
      case 'completed':
        return 'text-green-700'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="h-2 w-2 bg-green-500 rounded-full" />
      case 'planning':
        return <div className="h-2 w-2 bg-blue-500 rounded-full" />
      case 'on_hold':
        return <div className="h-2 w-2 bg-yellow-500 rounded-full" />
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'cancelled':
        return <div className="h-2 w-2 bg-red-500 rounded-full" />
      default:
        return <div className="h-2 w-2 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={selectedProject?.id || ''}
        onValueChange={handleProjectSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder={isLoading ? 'Loading projects...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {projects.length > 0 ? (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-3 w-full">
                  <FolderOpen className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{project.name}</span>
                      {getStatusIcon(project.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.team_count} teams
                      </span>
                      <span>{project.task_count} tasks</span>
                      {project.progress_percentage > 0 && (
                        <span>{project.progress_percentage}% complete</span>
                      )}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          ) : !isLoading ? (
            <SelectItem value="no-projects" disabled>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FolderOpen className="h-4 w-4" />
                No projects found
              </div>
            </SelectItem>
          ) : null}
          
          {showCreateButton && (
            <>
              {projects.length > 0 && (
                <div className="border-t my-1" />
              )}
              <SelectItem value="create-new" disabled>
                <div className="w-full">
                  <ProjectCreationModal
                    workspaceId={workspaceId}
                    onProjectCreated={handleProjectCreated}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-auto p-2 font-normal"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Project
                      </Button>
                    }
                  />
                </div>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      {showCreateButton && (
        <ProjectCreationModal
          workspaceId={workspaceId}
          onProjectCreated={handleProjectCreated}
          trigger={
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
      )}
    </div>
  )
}