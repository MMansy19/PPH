'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ViewMode } from '@/types'
import { useTasksStore } from '@/store/useTasksStore'
import { LayoutGrid, Table, PieChart, Map, Calendar, List } from 'lucide-react'

const VIEW_ICONS = {
  board: LayoutGrid,
  table: Table,
  portfolio: PieChart,
  map: Map,
  calendar: Calendar,
  list: List,
}

export function ModeSwitcher() {
  const { viewMode, setViewMode } = useTasksStore()
  
  const modes: { value: ViewMode; label: string }[] = [
    { value: 'portfolio', label: '📊 Portfolio Bubble' },
    { value: 'board', label: '📋 Board' },
    { value: 'table', label: '📊 Table' },
    { value: 'map', label: '🗺️ Map' },
    { value: 'calendar', label: '📅 Calendar' },
    { value: 'list', label: '📝 List' },
  ]
  
  const Icon = VIEW_ICONS[viewMode]
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon className="h-4 w-4" />
          {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {modes.map(mode => (
          <DropdownMenuItem 
            key={mode.value} 
            onClick={() => setViewMode(mode.value)}
            className={viewMode === mode.value ? 'bg-accent' : ''}
          >
            {mode.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
