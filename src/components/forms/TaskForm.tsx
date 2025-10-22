'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
}

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  const { addTask, updateTask } = useTasks()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    entity_type: 'task' as 'task' | 'event' | 'activity' | 'process',
    category: 'other' as 'big_bets' | 'line_extensions' | 'ltos' | 'other',
    value: 5,
    risk: 5,
    npv: 1,
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        duration: task.duration,
        priority: task.priority,
        entity_type: task.entity_type,
        category: task.category || 'other',
        value: task.value || 5,
        risk: task.risk || 5,
        npv: task.npv || 1,
      })
    } else {
      setFormData({
        title: '',
        duration: '',
        priority: 'medium',
        entity_type: 'task',
        category: 'other',
        value: 5,
        risk: 5,
        npv: 1,
      })
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (task) {
        await updateTask(task.id, formData)
      } else {
        await addTask({
          ...formData,
          completed: false,
        })
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration</label>
            <Input
              placeholder="e.g., 2w, 3d, 4h"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Entity Type</label>
              <Select 
                value={formData.entity_type} 
                onValueChange={(value: 'task' | 'event' | 'activity' | 'process') => 
                  setFormData({ ...formData, entity_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={formData.category} 
              onValueChange={(value: 'big_bets' | 'line_extensions' | 'ltos' | 'other') => 
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="big_bets">Big Bets</SelectItem>
                <SelectItem value="line_extensions">Line Extensions</SelectItem>
                <SelectItem value="ltos">LTOs</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Value (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Risk (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.risk}
                onChange={(e) => setFormData({ ...formData, risk: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">NPV (Millions)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={formData.npv}
                onChange={(e) => setFormData({ ...formData, npv: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
