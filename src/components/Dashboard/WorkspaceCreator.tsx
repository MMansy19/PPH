'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/auth'
import type { Workspace } from '@/types'

interface WorkspaceCreatorProps {
  userId: string
  onWorkspaceCreated: (workspace: Workspace) => void
}

export function WorkspaceCreator({ userId, onWorkspaceCreated }: WorkspaceCreatorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📊',
    theme_color: '#3B82F6'
  })

  const icons = ['📊', '💼', '🎯', '🚀', '📈', '🏆', '⚡', '🎨', '💡', '🔥']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          user_id: userId,
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
          theme_color: formData.theme_color,
          is_default: false
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        onWorkspaceCreated(data)
        setFormData({ name: '', description: '', icon: '📊', theme_color: '#3B82F6' })
        setOpen(false)
      }
    } catch (error) {
      console.error('Error creating workspace:', error)
      alert('Failed to create workspace. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your tasks and projects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Workspace Name *</label>
            <Input
              placeholder="e.g., Product Launch Q4"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Brief description of this workspace..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`text-2xl p-2 rounded hover:bg-gray-100 transition ${
                    formData.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Theme Color</label>
            <div className="flex gap-2">
              {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme_color: color })}
                  className={`w-10 h-10 rounded-full transition ${
                    formData.theme_color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name}>
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
