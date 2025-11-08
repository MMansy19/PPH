'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useTasksStore } from '@/store/useTasksStore'
import { useSelectedProject } from '@/hooks/useSelectedProject'
import { Task } from '@/types'

interface TaskFormProps {
  workspaceId?: string
  onClose?: () => void
  task?: Task
  onTaskCreated?: (task: Task) => void
  onTaskUpdated?: (task: Task) => void
}

export function TaskForm({ workspaceId, onClose, task, onTaskCreated, onTaskUpdated }: TaskFormProps) {
  const { createTask, editTask, error } = useTasksStore()
  const { selectedProject } = useSelectedProject()
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as const,
    category: task?.category || 'big_bets' as const,
    value: task?.value || 50,
    risk: task?.risk || 50,
    npv: task?.npv || 0,
    status: task?.status || 'todo' as const,
    duration: task?.duration || '1w',
    entity_type: task?.entity_type || 'task' as const,
    start_date: task?.start_date || new Date().toISOString().split('T')[0],
    end_date: task?.end_date || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!workspaceId) {
      setFormError('No workspace selected')
      return
    }

    setIsSubmitting(true)
    setFormError('')
    
    try {
      // Check if project is selected
      if (!selectedProject?.id) {
        setFormError('Please select a project first before creating tasks')
        return
      }

      const taskData = {
        ...formData,
        workspace_id: workspaceId,
        project_id: selectedProject.id,
        completed: false,
      }

      let success = false
      
      if (task?.id) {
        // Update existing task
        success = await editTask(task.id, taskData)
      } else {
        // Create new task
        success = await createTask(taskData)
      }
      
      if (success && onClose) {
        onClose()
      } else if (!success) {
        setFormError(error || 'Failed to save task')
      }
    } catch (error: any) {
      console.error('Error saving task:', error)
      setFormError(error.message || 'An error occurred while saving the task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(formError || error) && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {formError || error}
        </div>
      )}

      {/* Project Info */}
      {selectedProject ? (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Creating task in: <span className="font-semibold">{selectedProject.name}</span>
              </p>
              <p className="text-xs text-blue-700">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ No project selected. Please select a project first to create tasks.
          </p>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter task title..."
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your task..."
          rows={3}
        />
      </div>

      {/* Priority and Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="big_bets">Big Bets</SelectItem>
              <SelectItem value="line_extensions">Line Extensions</SelectItem>
              <SelectItem value="ltos">LTOs</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Entity Type and Duration Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entity_type">Entity Type</Label>
          <Select value={formData.entity_type} onValueChange={(value) => handleInputChange('entity_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="process">Process</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (e.g., 12w, 3d, 4h)</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 12w, 3d, 4h"
          />
        </div>
      </div>

      {/* Start Date and End Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date (Optional)</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
          />
        </div>
      </div>

      {/* NPV */}
      <div className="space-y-2">
        <Label htmlFor="npv">NPV (Net Present Value in Millions)</Label>
        <Input
          id="npv"
          type="number"
          step="0.1"
          value={formData.npv}
          onChange={(e) => handleInputChange('npv', parseFloat(e.target.value) || 0)}
          placeholder="Enter NPV in millions..."
        />
      </div>

      {/* Value and Risk Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Value: {formData.value}%</Label>
          <input
            type="range"
            id="value"
            min="0"
            max="100"
            value={formData.value}
            onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk">Risk: {formData.risk}%</Label>
          <input
            type="range"
            id="risk"
            min="0"
            max="100"
            value={formData.risk}
            onChange={(e) => handleInputChange('risk', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
          {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
        </Button>
      </div>
    </form>
  )
}
