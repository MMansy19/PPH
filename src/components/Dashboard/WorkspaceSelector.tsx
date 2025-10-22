'use client'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/auth'
import type { Workspace } from '@/types'
import { WorkspaceCreator } from './WorkspaceCreator'

interface WorkspaceSelectorProps {
  userId: string
  currentWorkspaceId: string | null
  onWorkspaceChange: (workspaceId: string) => void
}

export function WorkspaceSelector({ userId, currentWorkspaceId, onWorkspaceChange }: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkspaces()
  }, [userId])

  const loadWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setWorkspaces(data)
        // If no workspace selected, select the first or default one
        if (!currentWorkspaceId) {
          const defaultWorkspace = data.find(w => w.is_default) || data[0]
          onWorkspaceChange(defaultWorkspace.id)
        }
      } else {
        // Create default workspace if none exists
        await createDefaultWorkspace()
      }
    } catch (error) {
      console.error('Error loading workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultWorkspace = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          user_id: userId,
          name: 'My Workspace',
          description: 'Default workspace',
          icon: '📊',
          theme_color: '#3B82F6',
          is_default: true
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setWorkspaces([data])
        onWorkspaceChange(data.id)
      }
    } catch (error) {
      console.error('Error creating default workspace:', error)
    }
  }

  const handleWorkspaceCreated = (workspace: Workspace) => {
    setWorkspaces([workspace, ...workspaces])
    onWorkspaceChange(workspace.id)
  }

  if (loading) {
    return <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
  }

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId)

  return (
    <div className="flex items-center gap-2">
      <Select value={currentWorkspaceId || undefined} onValueChange={onWorkspaceChange}>
        <SelectTrigger className="w-64">
          <SelectValue>
            {currentWorkspace && (
              <span className="flex items-center gap-2">
                <span>{currentWorkspace.icon}</span>
                <span>{currentWorkspace.name}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              <div className="flex items-center gap-2">
                <span>{workspace.icon}</span>
                <span>{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <WorkspaceCreator userId={userId} onWorkspaceCreated={handleWorkspaceCreated} />
    </div>
  )
}
