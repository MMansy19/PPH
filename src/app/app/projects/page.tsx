'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectCreationModal } from '@/components/projects/ProjectCreationModal'
import { ProjectDashboard } from '@/components/projects/ProjectDashboard'
import { useRequireAuth } from '@/hooks/useAuth'
import { useTasksStore } from '@/store/useTasksStore'
import { ProjectService } from '@/lib/project-service'
import { ProjectWithTeams, ProjectStatus } from '@/types/team'
import { useSelectedProject } from '@/hooks/useSelectedProject'
import { useToast } from '@/components/Toast'
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  FolderOpen,
  BarChart3
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

type ViewMode = 'grid' | 'list' | 'dashboard'

export default function ProjectsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useRequireAuth('/auth/login')
  const { currentWorkspaceId } = useTasksStore()
  const { selectedProject, setSelectedProject } = useSelectedProject()
  const { success, error } = useToast()
  
  // State
  const [projects, setProjects] = useState<ProjectWithTeams[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithTeams[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const projectService = new ProjectService()

  // Load projects when workspace changes
  useEffect(() => {
    if (currentWorkspaceId) {
      loadProjects()
    }
  }, [currentWorkspaceId])

  // Filter projects based on search and status
  useEffect(() => {
    let filtered = projects

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, statusFilter])

  const loadProjects = async () => {
    if (!currentWorkspaceId) return

    setIsLoading(true)
    try {
      const result = await projectService.getWorkspaceProjects(currentWorkspaceId)
      if (result.data) {
        setProjects(result.data)
        
        // Auto-select first project if none selected
        if (!selectedProject && result.data.length > 0) {
          setSelectedProject(result.data[0])
        }
      } else if (result.error) {
        error('Load Error', result.error.message)
      }
    } catch (err) {
      error('Load Error', 'Failed to load projects')
      console.error('Error loading projects:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectCreated = async (newProject: any) => {
    success('Project Created', `${newProject.name} has been created successfully`)
    await loadProjects()
  }

  const handleProjectClick = (project: ProjectWithTeams) => {
    setSelectedProject(project)
    if (viewMode !== 'dashboard') {
      setViewMode('dashboard')
    }
  }

  const handleProjectUpdate = async (updatedProject: ProjectWithTeams) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject)
    }
    success('Project Updated', 'Project has been updated successfully')
  }

  const handleProjectDelete = async (projectId: string) => {
    try {
      const result = await projectService.deleteProject(projectId)
      if (result.error) {
        error('Delete Error', result.error.message)
        return
      }

      setProjects(prev => prev.filter(p => p.id !== projectId))
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
      }
      success('Project Deleted', 'Project has been deleted successfully')
    } catch (err) {
      error('Delete Error', 'Failed to delete project')
      console.error('Error deleting project:', err)
    }
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'active': return 'Active'
      case 'planning': return 'Planning'
      case 'on_hold': return 'On Hold'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!currentWorkspaceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-responsive safe-area-inset">
        <div className="container-responsive max-w-7xl">
          <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
            <Button variant="ghost" size="sm" asChild className="mb-3 sm:mb-4 touch-target">
              <Link href="/app" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm sm:text-base">Back to Dashboard</span>
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Select a Workspace
              </h2>
              <p className="text-gray-600 mb-6">
                Projects are organized within workspaces. Please select a workspace first to view your projects.
              </p>
              <Button asChild>
                <Link href="/app">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Projects
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your projects and organize teams around common goals
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ProjectCreationModal
                workspaceId={currentWorkspaceId}
                onProjectCreated={handleProjectCreated}
                trigger={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Project</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            {viewMode !== 'dashboard' && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value: ProjectStatus | 'all') => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Grid View */}
          <TabsContent value="grid" className="space-y-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Create your first project to get started organizing your teams and tasks.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {projects.length === 0 && (
                  <ProjectCreationModal
                    workspaceId={currentWorkspaceId}
                    onProjectCreated={handleProjectCreated}
                    trigger={
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Project
                      </Button>
                    }
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onProjectClick={handleProjectClick}
                    onProjectUpdate={handleProjectUpdate}
                    onProjectDelete={handleProjectDelete}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Create your first project to get started organizing your teams and tasks.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {projects.length === 0 && (
                  <ProjectCreationModal
                    workspaceId={currentWorkspaceId}
                    onProjectCreated={handleProjectCreated}
                    trigger={
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Project
                      </Button>
                    }
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Teams</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tasks</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleProjectClick(project)}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{project.name}</h3>
                              {project.description && (
                                <p className="text-sm text-gray-600 truncate">{project.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{project.team_count}</td>
                          <td className="py-3 px-4 text-gray-600">{project.task_count}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${project.progress_percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {project.progress_percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(project.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Dashboard View */}
          <TabsContent value="dashboard" className="space-y-6">
            {selectedProject ? (
              <ProjectDashboard
                project={selectedProject}
                onProjectUpdate={handleProjectUpdate}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Project
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose a project from the grid or list view to see its detailed dashboard.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setViewMode('grid')}
                  className="gap-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Browse Projects
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}