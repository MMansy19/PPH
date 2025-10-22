'use client'
import React from 'react'
import { useTasksStore } from '@/store/useTasksStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CalendarView() {
  const { tasks } = useTasksStore()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Calendar view coming soon!</p>
          <p className="text-sm text-gray-400">
            {tasks.length} tasks will be displayed in timeline format
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
