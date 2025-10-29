'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ModeSwitcher } from '@/components/Dashboard/ModeSwitcher'
import { ExportButtons } from '@/components/Dashboard/ExportButtons'
import { MobileMenu } from '@/components/Dashboard/MobileMenu'
import { WorkspaceSelector } from '@/components/Dashboard/WorkspaceSelector'
import { PortfolioBubbleChart } from '@/components/views/PortfolioBubbleChart'
import { TableView } from '@/components/views/TableView'
import { MapView } from '@/components/views/MapView'
import { BoardView } from '@/components/views/BoardView'
import { CalendarView } from '@/components/calendar/CalendarView'
import { ListView } from '@/components/views/ListView'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useTasksStore } from '@/store/useTasksStore'
import { useTasks } from '@/hooks/useTasks'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRequireAuth } from '@/hooks/useAuth'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TaskForm } from '@/components/forms/TaskForm'

export default function DashboardPage() {
  const router = useRouter()
  const { viewMode, currentWorkspaceId, setCurrentWorkspaceId } = useTasksStore()
  const { loading: tasksLoading } = useTasks()
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Use the proper auth hooks
  const { user, loading: authLoading } = useRequireAuth('/auth/login')
  const { signOut } = useAuth()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const renderView = () => {
    if (!currentWorkspaceId) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Please select or create a workspace to get started</p>
        </div>
      )
    }

    switch (viewMode) {
      case 'portfolio':
        return <PortfolioBubbleChart />
      case 'table':
        return <TableView />
      case 'map':
        return <MapView />
      case 'board':
        return <BoardView />
      case 'calendar':
        return <CalendarView />
      case 'list':
        return <ListView />
      default:
        return <PortfolioBubbleChart />
    }
  }

  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personal Process Hub
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {viewMode === 'portfolio' && '📊 Portfolio Bubble Chart'}
              {viewMode === 'board' && '📋 Kanban Board'}
              {viewMode === 'table' && '📊 Data Table'}
              {viewMode === 'map' && '🗺️ Process Map'}
              {viewMode === 'calendar' && '📅 Calendar View'}
              {viewMode === 'list' && '📝 List View'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Workspace Selector and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {user && (
              <WorkspaceSelector 
                userId={user.id} 
                currentWorkspaceId={currentWorkspaceId}
                onWorkspaceChange={setCurrentWorkspaceId}
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {currentWorkspaceId && (
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your workspace
                    </DialogDescription>
                  </DialogHeader>
                  <TaskForm 
                    workspaceId={currentWorkspaceId} 
                    onClose={() => setTaskDialogOpen(false)}
                    onTaskCreated={(task) => {
                      console.log('Task created:', task)
                      // TODO: Refresh tasks data or add to store
                      setTaskDialogOpen(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
            <div className="hidden md:flex gap-2">
              <ModeSwitcher />
              <ExportButtons />
            </div>
            {isMobile && <MobileMenu />}
          </div>
        </div>

        {/* View Content */}
        <div className="view-container w-full">
          {renderView()}
        </div>
      </div>
    </div>
  )
}
