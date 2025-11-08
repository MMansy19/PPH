'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, FolderOpen, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ProjectService } from '@/lib/project-service'
import { ProjectWithTeams } from '@/types/team'
import { ProjectCreationModal } from './ProjectCreationModal'

interface ProjectSelectorCompactProps {
  workspaceId: string
  selectedProjectId?: string
  onProjectSelect: (project: ProjectWithTeams | null) => void
}

export function ProjectSelectorCompact({
  workspaceId,
  selectedProjectId,
  onProjectSelect
}: ProjectSelectorCompactProps) {
  const [projects, setProjects] = useState<ProjectWithTeams[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectWithTeams | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

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
    } else if (!selectedProject && projects.length > 0) {
      // Auto-select first project if none selected
      setSelectedProject(projects[0])
      onProjectSelect(projects[0])
    }
  }, [selectedProjectId, projects, onProjectSelect, selectedProject])

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

  const handleProjectSelect = (project: ProjectWithTeams) => {
    setSelectedProject(project)
    onProjectSelect(project)
    setIsOpen(false)
  }

  const handleProjectCreated = (newProject: any) => {
    loadProjects() // Refresh the list
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'planning': return 'bg-blue-500'
      case 'on_hold': return 'bg-yellow-500'
      case 'completed': return 'bg-green-600'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-3 h-auto bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FolderOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex flex-col items-start min-w-0 flex-1">
                {selectedProject ? (
                  <>
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-medium text-sm truncate">
                        {selectedProject.name}
                      </span>
                      <div 
                        className={`h-2 w-2 rounded-full flex-shrink-0 ${getStatusColor(selectedProject.status)}`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 w-full">
                      <span>{selectedProject.team_count} teams</span>
                      <span>•</span>
                      <span>{selectedProject.task_count} tasks</span>
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Select project...</span>
                )}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[280px]" align="start">
          {projects.length > 0 ? (
            projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className="flex items-center gap-3 p-3"
              >
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{project.name}</span>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {project.team_count} teams • {project.task_count} tasks
                    {project.progress_percentage > 0 && (
                      <span> • {project.progress_percentage}% complete</span>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FolderOpen className="h-4 w-4" />
                No projects found
              </div>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <ProjectCreationModal
              workspaceId={workspaceId}
              onProjectCreated={handleProjectCreated}
              trigger={
                <div className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                  <Plus className="h-4 w-4" />
                  <span>Create New Project</span>
                </div>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}