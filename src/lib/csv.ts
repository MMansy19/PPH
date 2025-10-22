import { Task } from '@/types'

export function exportToCSV(tasks: Task[], filename: string = 'portfolio.csv') {
  // Define CSV headers
  const headers = ['Title', 'Category', 'Value', 'Risk', 'NPV ($M)', 'Duration', 'Priority', 'Type', 'Status']
  
  // Convert tasks to CSV rows
  const rows = tasks.map(task => [
    escapeCSV(task.title),
    escapeCSV(task.category?.replace('_', ' ') || 'N/A'),
    task.value || 'N/A',
    task.risk || 'N/A',
    task.npv || 'N/A',
    escapeCSV(task.duration),
    escapeCSV(task.priority),
    escapeCSV(task.entity_type),
    task.completed ? 'Completed' : 'Active'
  ])
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

// Helper to escape CSV special characters
function escapeCSV(value: string): string {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}
