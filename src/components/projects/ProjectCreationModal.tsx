'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectService } from '@/lib/project-service'
import { CreateProjectInput, ProjectStatus } from '@/types/team'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/Toast'
import { Plus, FolderPlus } from 'lucide-react'

interface ProjectCreationModalProps {
  workspaceId: string
  onProjectCreated?: (project: any) => void
  trigger?: React.ReactNode
}

const projectStatuses: { value: ProjectStatus; label: string; description: string }[] = [
  { value: 'planning', label: 'Planning', description: 'Project is in planning phase' },
  { value: 'active', label: 'Active', description: 'Project is actively being worked on' },
  { value: 'on_hold', label: 'On Hold', description: 'Project is temporarily paused' },
]

export function ProjectCreationModal({ 
  workspaceId, 
  onProjectCreated,
  trigger 
}: ProjectCreationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateProjectInput>({
    workspace_id: workspaceId,
    name: '',
    description: '',
    status: 'planning',
    settings: {
      allow_team_assignment: true,
      task_assignment_rules: 'team_leads',
      visibility: 'workspace',
      auto_archive_completed: true
    }
  })

  const { user } = useAuth()
  const { success, error } = useToast()
  const projectService = new ProjectService()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      error('Authentication Required', 'You must be logged in to create a project')
      return
    }

    if (!formData.name.trim()) {
      error('Validation Error', 'Project name is required')
      return
    }

    setIsLoading(true)

    try {
      const result = await projectService.createProject(formData, user.id)
      
      if (result.error) {
        error('Creation Failed', result.error.message || 'Failed to create project')
        return
      }

      if (result.data) {
        success('Project Created', `"${result.data.name}" has been created successfully`)
        onProjectCreated?.(result.data)
        setIsOpen(false)
        
        // Reset form
        setFormData({
          workspace_id: workspaceId,
          name: '',
          description: '',
          status: 'planning',
          settings: {
            allow_team_assignment: true,
            task_assignment_rules: 'team_leads',
            visibility: 'workspace',
            auto_archive_completed: true
          }
        })
      }
    } catch (err) {
      console.error('Error creating project:', err)
      error('Unexpected Error', 'An unexpected error occurred while creating the project')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof CreateProjectInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateSettings = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Create a new project to organize teams and tasks around a common goal or initiative.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="e.g., Mobile App Launch, Q4 Marketing Campaign"
                className="mt-1"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Brief description of the project goals and objectives..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="project-status">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProjectStatus) => updateFormData('status', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex flex-col">
                        <span>{status.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {status.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.settings?.visibility || 'workspace'}
                onValueChange={(value: 'private' | 'workspace') => updateSettings('visibility', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workspace">
                    <div className="flex flex-col">
                      <span>Workspace</span>
                      <span className="text-xs text-muted-foreground">
                        Visible to all workspace members
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex flex-col">
                      <span>Private</span>
                      <span className="text-xs text-muted-foreground">
                        Only visible to project admin and team members
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="task-assignment">Task Assignment Rules</Label>
              <Select
                value={formData.settings?.task_assignment_rules || 'team_leads'}
                onValueChange={(value: 'admin_only' | 'team_leads' | 'all_members') => 
                  updateSettings('task_assignment_rules', value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin_only">
                    <div className="flex flex-col">
                      <span>Admin Only</span>
                      <span className="text-xs text-muted-foreground">
                        Only project admins can assign tasks
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="team_leads">
                    <div className="flex flex-col">
                      <span>Team Leads</span>
                      <span className="text-xs text-muted-foreground">
                        Project admins and team admins can assign tasks
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="all_members">
                    <div className="flex flex-col">
                      <span>All Members</span>
                      <span className="text-xs text-muted-foreground">
                        Any team member can assign tasks
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}