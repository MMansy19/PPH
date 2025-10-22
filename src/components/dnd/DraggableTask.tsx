'use client'
import React from 'react'
import { useDrag } from 'react-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/types'
import { CATEGORY_COLORS } from '@/lib/utils'

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

  return (
    <Card 
      ref={drag as any}
      className={`cursor-move transition-opacity hover:shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ 
        borderLeft: `4px solid ${CATEGORY_COLORS[task.category || 'other']}` 
      }}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <p className="font-medium text-sm leading-tight flex-1">{task.title}</p>
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
        </div>
      </CardContent>
    </Card>
  )
}
