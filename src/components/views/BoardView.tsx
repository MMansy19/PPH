'use client'
import React from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTasksStore } from '@/store/useTasksStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DraggableTask } from '@/components/dnd/DraggableTask'
import { Task } from '@/types'

interface DropZoneProps {
  status: 'todo' | 'in-progress' | 'done'
  title: string
  icon: string
  tasks: Task[]
  onDrop: (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => void
}

function DropZone({ status, title, icon, tasks, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; task: Task }) => {
      onDrop(item.id, status)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, onDrop])

  const bgColor = status === 'todo' ? 'bg-gray-50' : status === 'in-progress' ? 'bg-blue-50' : 'bg-green-50'
  const borderColor = status === 'todo' ? 'border-gray-200' : status === 'in-progress' ? 'border-blue-200' : 'border-green-200'

  return (
    <Card 
      ref={drop as any}
      className={`min-w-[300px] flex-1 transition-all ${isOver ? 'ring-2 ring-blue-400 scale-[1.02]' : ''} ${borderColor}`}
    >
      <CardHeader className={`pb-3 ${bgColor}`}>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{title}</span>
          </span>
          <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[600px] overflow-y-auto pt-4">
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
  const { currentWorkspaceId, tasks, editTask } = useTasksStore()

  // Filter tasks by current workspace and group by status
  const workspaceTasks = tasks.filter(t => t.workspace_id === currentWorkspaceId)
  const todoTasks = workspaceTasks.filter(t => t.status === 'todo')
  const inProgressTasks = workspaceTasks.filter(t => t.status === 'in-progress')
  const doneTasks = workspaceTasks.filter(t => t.status === 'done')

  const handleDrop = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const updates: Partial<Task> = {
      status: newStatus,
      completed: newStatus === 'done'
    }
    
    // Update using the store's editTask method
    const success = await editTask(taskId, updates)
    if (!success) {
      console.error('Failed to update task status')
    }
  }

  if (!currentWorkspaceId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a workspace to view tasks</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <p className="text-gray-500 text-sm">Drag and drop tasks between columns to update status</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        <DropZone 
          status="todo" 
          title="To Do" 
          icon="📝"
          tasks={todoTasks}
          onDrop={handleDrop}
        />
        <DropZone 
          status="in-progress" 
          title="In Progress" 
          icon="⚡"
          tasks={inProgressTasks}
          onDrop={handleDrop}
        />
        <DropZone 
          status="done" 
          title="Done" 
          icon="✅"
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
