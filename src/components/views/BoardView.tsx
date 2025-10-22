'use client'
import React from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTasks } from '@/hooks/useTasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DraggableTask } from '@/components/dnd/DraggableTask'
import { Task } from '@/types'

interface DropZoneProps {
  status: 'todo' | 'inprogress' | 'done'
  title: string
  tasks: Task[]
  onDrop: (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => void
}

function DropZone({ status, title, tasks, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; task: Task }) => {
      onDrop(item.id, status)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, onDrop])

  return (
    <Card 
      ref={drop as any}
      className={`min-w-[300px] flex-1 transition-colors ${isOver ? 'bg-blue-50 border-blue-300' : ''}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Drop tasks here
          </div>
        ) : (
          tasks.map(task => (
            <DraggableTask key={task.id} task={task} />
          ))
        )}
      </CardContent>
    </Card>
  )
}

function BoardViewContent() {
  const { tasks, updateTask } = useTasks()

  // Group tasks by status
  const todoTasks = tasks.filter(t => !t.completed && t.priority !== 'high')
  const inProgressTasks = tasks.filter(t => !t.completed && t.priority === 'high')
  const doneTasks = tasks.filter(t => t.completed)

  const handleDrop = async (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
    const updates: Partial<Task> = {}
    
    if (newStatus === 'done') {
      updates.completed = true
    } else if (newStatus === 'inprogress') {
      updates.completed = false
      updates.priority = 'high'
    } else {
      updates.completed = false
      updates.priority = 'medium'
    }
    
    await updateTask(taskId, updates)
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <p className="text-gray-500 text-sm">Drag and drop tasks between columns</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        <DropZone 
          status="todo" 
          title="📋 To Do" 
          tasks={todoTasks}
          onDrop={handleDrop}
        />
        <DropZone 
          status="inprogress" 
          title="🔄 In Progress" 
          tasks={inProgressTasks}
          onDrop={handleDrop}
        />
        <DropZone 
          status="done" 
          title="✅ Done" 
          tasks={doneTasks}
          onDrop={handleDrop}
        />
      </div>
    </div>
  )
}

export function BoardView() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BoardViewContent />
    </DndProvider>
  )
}
