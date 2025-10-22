'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TaskFormProps {
  workspaceId?: string
  onClose?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  task?: any
}

export function TaskForm({ workspaceId, onClose, open = false, onOpenChange, task }: TaskFormProps) {
  const handleClose = () => {
    if (onClose) onClose()
    if (onOpenChange) onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>
        <p className="text-gray-600 mb-4">Task form functionality will be implemented here.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>
            {task ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  )
}
