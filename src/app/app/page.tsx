'use client'
import React from 'react'
import { ModeSwitcher } from '@/components/Dashboard/ModeSwitcher'
import { ExportButtons } from '@/components/Dashboard/ExportButtons'
import { PortfolioBubbleChart } from '@/components/views/PortfolioBubbleChart'
import { TableView } from '@/components/views/TableView'
import { MapView } from '@/components/views/MapView'
import { BoardView } from '@/components/views/BoardView'
import { CalendarView } from '@/components/views/CalendarView'
import { ListView } from '@/components/views/ListView'
import { useTasksStore } from '@/store/useTasksStore'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const { viewMode } = useTasksStore()
  const { loading } = useTasks()

  const renderView = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
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
          
          <div className="flex flex-wrap gap-2">
            <ExportButtons />
            <ModeSwitcher />
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
