'use client'
import { useState } from 'react'
import { useTasksStore } from '@/store/useTasksStore'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskForm } from '@/components/forms/TaskForm'
import { Task } from '@/types'
import { Edit2, Trash2, Plus } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  big_bets: '#10b981',
  line_extensions: '#f97316',
  ltos: '#3b82f6',
  other: '#ef4444',
}

const CATEGORY_LABELS: Record<string, string> = {
  big_bets: 'Big Bets',
  line_extensions: 'Line Extensions',
  ltos: 'LTOs',
  other: 'Other',
}

export function TableView() {
  const { tasks, currentWorkspaceId, removeTask, loading } = useTasksStore()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  // Filter tasks by current workspace
  const workspaceTasks = tasks.filter(t => t.workspace_id === currentWorkspaceId)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingTask(undefined)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await removeTask(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(undefined)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div>Loading tasks...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full card-responsive">
      <CardHeader className="p-responsive">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Task Portfolio ({workspaceTasks.length})</CardTitle>
          <Button onClick={handleAddNew} size="sm" className="flex items-center gap-2 w-full sm:w-auto touch-target">
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Add Task</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {workspaceTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base mb-4">No tasks in this workspace yet</p>
              <Button onClick={handleAddNew} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            </div>
          ) : (
            workspaceTasks.map((task) => (
              <Card key={task.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  {/* Title and Category */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base">{task.title}</h3>
                    <Badge 
                      style={{ 
                        backgroundColor: CATEGORY_COLORS[task.category || 'other'],
                        color: 'white'
                      }}
                      className="text-xs"
                    >
                      {CATEGORY_LABELS[task.category || 'other']}
                    </Badge>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Value</p>
                      <p className="font-medium">{task.value}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Risk</p>
                      <p className="font-medium">{task.risk}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">NPV</p>
                      <p className="font-medium">${task.npv}M</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      onClick={() => handleEdit(task)} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 touch-target"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDelete(task.id)} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 hover:bg-red-50 border-red-200 touch-target"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Risk</TableHead>
                <TableHead className="text-right">NPV</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaceTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No tasks found. Click &quot;Add Task&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                workspaceTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>
                        <div>{task.title}</div>
                        <div className="text-xs text-gray-500">
                          {task.duration} • {task.priority} priority
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        style={{ 
                          backgroundColor: CATEGORY_COLORS[task.category || 'other'],
                          color: 'white'
                        }}
                      >
                        {CATEGORY_LABELS[task.category || 'other']}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{task.value}/10</TableCell>
                    <TableCell className="text-right">{task.risk}/10</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${task.npv}M
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(task)}
                          className="hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            workspaceId={currentWorkspaceId || undefined}
            onClose={handleCloseForm} 
            task={editingTask}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
