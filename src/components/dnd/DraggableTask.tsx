'use client'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskForm } from '@/components/forms/TaskForm'
import { Task } from '@/types'
import { CATEGORY_COLORS } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import { useTasksStore } from '@/store/useTasksStore'

interface Props {
  task: Task
  onStatusChange?: (taskId: string, completed: boolean) => void
}

export function DraggableTask({ task, onStatusChange }: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [task])

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { removeTask } = useTasksStore()

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this task?')) {
      await removeTask(task.id)
    }
  }

  return (
    <>
      <Card 
        ref={drag as any}
        className={`cursor-move transition-all hover:shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'} group`}
        style={{ 
          borderLeft: `4px solid ${CATEGORY_COLORS[task.category || 'other']}` 
        }}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
              <p className="font-medium text-sm leading-tight flex-1">{task.title}</p>
              <div className="flex items-center gap-1">
                <Badge 
                  className="text-xs flex-shrink-0"
                  style={{ 
                    backgroundColor: CATEGORY_COLORS[task.category || 'other'],
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {task.category?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{task.duration}</span>
              <span className={`px-2 py-0.5 rounded ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
            </div>
            {(task.value !== undefined || task.risk !== undefined) && (
              <div className="flex gap-3 text-xs">
                <span>Value: {task.value}/10</span>
                <span>Risk: {task.risk}/10</span>
              </div>
            )}
            {/* Action Buttons - Visible on hover */}
            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-7 w-7 p-0 hover:bg-blue-50"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            workspaceId={task.workspace_id}
            task={task}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
