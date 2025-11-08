'use client'
import React from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTasksStore } from '@/store/useTasksStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DraggableTask } from '@/components/dnd/DraggableTask'
import { Task } from '@/types'

interface DropZoneProps {
  status: 'todo' | 'in-progress' | 'review' | 'done'
  title: string
  icon: string
  tasks: Task[]
  onDrop: (taskId: string, newStatus: 'todo' | 'in-progress' | 'review' | 'done') => void
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

  const bgColor = status === 'todo' ? 'bg-gray-50' : 
                 status === 'in-progress' ? 'bg-blue-50' : 
                 status === 'review' ? 'bg-orange-50' : 'bg-green-50'
  const borderColor = status === 'todo' ? 'border-gray-200' : 
                     status === 'in-progress' ? 'border-blue-200' : 
                     status === 'review' ? 'border-orange-200' : 'border-green-200'

  return (
    <Card 
      ref={drop as any}
      className={`min-w-[280px] sm:min-w-[300px] md:min-w-[320px] flex-1 transition-all duration-200 ${isOver ? 'ring-2 ring-blue-400 scale-[1.02] shadow-lg' : 'shadow-sm'} ${borderColor}`}
    >
      <CardHeader className={`pb-2 sm:pb-3 px-3 sm:px-4 md:px-6 ${bgColor}`}>
        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center justify-between">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg">{icon}</span>
            <span className="font-semibold">{title}</span>
          </span>
          <span className="text-xs sm:text-sm font-normal text-gray-500 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[500px] sm:max-h-[600px] md:max-h-[650px] overflow-y-auto scrollbar-thin pt-3 sm:pt-4 px-2 sm:px-4 md:px-6">
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

interface BoardViewContentProps {
  projectId?: string
}

function BoardViewContent({ projectId }: BoardViewContentProps = {}) {
  const { currentWorkspaceId, tasks, editTask } = useTasksStore()

  // Filter tasks by project if specified, otherwise by workspace, then group by status
  const filteredTasks = tasks.filter(t => {
    if (projectId) {
      return t.project_id === projectId
    }
    return t.workspace_id === currentWorkspaceId
  })
  
  const todoTasks = filteredTasks.filter(t => t.status === 'todo')
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress')
  const reviewTasks = filteredTasks.filter(t => t.status === 'review')
  const doneTasks = filteredTasks.filter(t => t.status === 'done')

  const handleDrop = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'review' | 'done') => {
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

  if (!projectId && !currentWorkspaceId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a {projectId ? 'project' : 'workspace'} to view tasks</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Kanban Board</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Drag and drop tasks between columns to update status</p>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin -mx-2 px-2 sm:mx-0 sm:px-0">
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
          status="review" 
          title="Review" 
          icon="👀"
          tasks={reviewTasks}
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

export function BoardView({ projectId }: { projectId?: string } = {}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <BoardViewContent projectId={projectId} />
    </DndProvider>
  )
}
