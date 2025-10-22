'use client'
import React from 'react'
import { useTasksStore } from '@/store/useTasksStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORY_COLORS } from '@/lib/utils'

export function ListView() {
  const { tasks } = useTasksStore()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>List View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: CATEGORY_COLORS[task.category || 'other'] }}
              />
              <div className="flex-1">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">{task.entity_type} • {task.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Value: {task.value}/10</p>
                <p className="text-xs text-gray-500">Risk: {task.risk}/10</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
