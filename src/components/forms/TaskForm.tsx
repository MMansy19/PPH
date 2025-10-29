'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { tasksService, type Task } from '@/lib/tasks'

interface TaskFormProps {
  workspaceId?: string
  onClose?: () => void
  task?: Task
  onTaskCreated?: (task: Task) => void
  onTaskUpdated?: (task: Task) => void
}

export function TaskForm({ workspaceId, onClose, task, onTaskCreated, onTaskUpdated }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as const,
    category: task?.category || 'big_bets' as const,
    value: task?.value || 50,
    risk: task?.risk || 50,
    status: task?.status || 'todo'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!workspaceId) {
      setError('No workspace selected')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      const taskData = {
        ...formData,
        workspace_id: workspaceId,
      }

      if (task?.id) {
        // Update existing task
        const { data, error: updateError } = await tasksService.updateTask(task.id, taskData)
        if (updateError) {
          throw new Error(updateError.message || 'Failed to update task')
        }
        if (data && onTaskUpdated) {
          onTaskUpdated(data)
        }
      } else {
        // Create new task
        const { data, error: createError } = await tasksService.createTask(taskData)
        if (createError) {
          console.error('Create task error:', createError)
          throw new Error(createError.message || 'Failed to create task')
        }
        if (data && onTaskCreated) {
          onTaskCreated(data)
        }
      }
      
      if (onClose) onClose()
    } catch (error: any) {
      console.error('Error saving task:', error)
      setError(error.message || 'An error occurred while saving the task')
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
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
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
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
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
