'use client'
import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
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
  const { tasks, deleteTask, loading } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

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
      await deleteTask(id)
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Task Portfolio ({tasks.length})</CardTitle>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No tasks found. Click "Add Task" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
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
      
      <TaskForm 
        open={showForm} 
        onOpenChange={handleCloseForm} 
        task={editingTask}
      />
    </Card>
  )
}
