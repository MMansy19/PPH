'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Download, FileImage, FileText, Table } from 'lucide-react'
import { exportToCSV } from '@/lib/csv'
import { useTasks } from '@/hooks/useTasks'

export function ExportButtons() {
  const { tasks } = useTasks()
  const [exporting, setExporting] = useState(false)

  const exportPNG = async () => {
    try {
      setExporting(true)
      const html2canvas = (await import('html2canvas')).default
      const element = document.querySelector('.view-container') as HTMLElement
      
      if (!element) {
        alert('View container not found')
        return
      }

      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      })
      
      const link = document.createElement('a')
      link.download = `pph-portfolio-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('PNG export failed:', error)
      alert('Failed to export PNG. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const exportPDF = async () => {
    try {
      setExporting(true)
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      const element = document.querySelector('.view-container') as HTMLElement
      
      if (!element) {
        alert('View container not found')
        return
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`pph-portfolio-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleCSVExport = () => {
    try {
      setExporting(true)
      exportToCSV(tasks, `pph-portfolio-${new Date().toISOString().split('T')[0]}.csv`)
    } catch (error) {
      console.error('CSV export failed:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportPNG}>
          <FileImage className="h-4 w-4 mr-2" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCSVExport}>
          <Table className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
