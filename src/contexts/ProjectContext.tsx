'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Project, ProjectWithTeams } from '@/types/team'
import { ProjectService } from '@/lib/project-service'

interface ProjectContextType {
  // Current selected project
  selectedProject: ProjectWithTeams | null
  setSelectedProject: (project: ProjectWithTeams | null) => void
  
  // Projects for current workspace
  projects: ProjectWithTeams[]
  setProjects: (projects: ProjectWithTeams[]) => void
  
  // Loading states
  isLoading: boolean
  
  // Methods
  loadProjects: (workspaceId: string) => Promise<void>
  refreshProject: (projectId: string) => Promise<void>
  createProject: (workspaceId: string, projectData: any, adminId: string) => Promise<Project | null>
  updateProject: (projectId: string, updates: any) => Promise<ProjectWithTeams | null>
  deleteProject: (projectId: string) => Promise<boolean>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

interface ProjectProviderProps {
  children: ReactNode
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithTeams | null>(null)
  const [projects, setProjects] = useState<ProjectWithTeams[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const projectService = new ProjectService()

  const loadProjects = async (workspaceId: string) => {
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

  const refreshProject = async (projectId: string) => {
    try {
      const result = await projectService.getProject(projectId)
      if (result.data) {
        const projectWithTeams = result.data as ProjectWithTeams
        
        // Update in projects list
        setProjects(prev => prev.map(p => p.id === projectId ? projectWithTeams : p))
        
        // Update selected project if it's the current one
        if (selectedProject?.id === projectId) {
          setSelectedProject(projectWithTeams)
        }
      }
    } catch (error) {
      console.error('Error refreshing project:', error)
    }
  }

  const createProject = async (workspaceId: string, projectData: any, adminId: string): Promise<Project | null> => {
    try {
      const result = await projectService.createProject(projectData, adminId)
      if (result.data) {
        // Reload projects to get updated list with team counts
        await loadProjects(workspaceId)
        return result.data
      } else if (result.error) {
        console.error('Failed to create project:', result.error)
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
    return null
  }

  const updateProject = async (projectId: string, updates: any): Promise<ProjectWithTeams | null> => {
    try {
      const result = await projectService.updateProject(projectId, updates)
      if (result.data) {
        const updatedProject = result.data as ProjectWithTeams
        
        // Update in projects list
        setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p))
        
        // Update selected project if it's the current one
        if (selectedProject?.id === projectId) {
          setSelectedProject(updatedProject)
        }
        
        return updatedProject
      } else if (result.error) {
        console.error('Failed to update project:', result.error)
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
    return null
  }

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const result = await projectService.deleteProject(projectId)
      if (!result.error) {
        // Remove from projects list
        setProjects(prev => prev.filter(p => p.id !== projectId))
        
        // Clear selected project if it was the deleted one
        if (selectedProject?.id === projectId) {
          setSelectedProject(null)
        }
        
        return true
      } else {
        console.error('Failed to delete project:', result.error)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
    return false
  }

  // Auto-select first project if none selected and projects are available
  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0])
    }
  }, [projects, selectedProject])

  const value: ProjectContextType = {
    selectedProject,
    setSelectedProject,
    projects,
    setProjects,
    isLoading,
    loadProjects,
    refreshProject,
    createProject,
    updateProject,
    deleteProject
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}