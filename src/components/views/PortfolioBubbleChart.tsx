'use client'
import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { useTasksStore } from '@/store/useTasksStore'
import { Card, CardContent } from '@/components/ui/card'
import { CATEGORY_COLORS } from '@/lib/utils'
import { BubbleData } from '@/types'

export function PortfolioBubbleChart() {
  const { tasks, currentWorkspaceId } = useTasksStore()

  // Filter tasks by current workspace
  const workspaceTasks = tasks.filter(t => t.workspace_id === currentWorkspaceId)

  const data: BubbleData[] = workspaceTasks.map(task => ({
    x: task.value || 5,  // Value Score (1-10)
    y: 11 - (task.risk || 5),  // Risk inverted (low risk = high y)
    z: (task.npv || 1) * 100,   // Bubble size
    name: task.title,
    category: task.category,
    fill: CATEGORY_COLORS[task.category || 'other']
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">Value: {data.x}/10</p>
          <p className="text-sm">Risk: {11 - data.y}/10</p>
          <p className="text-sm">NPV: ${(data.z / 100).toFixed(1)}M</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full card-responsive">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="spacing-responsive">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Prioritized Process Portfolio</h2>
            
            {/* Legend - Responsive Layout */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS.big_bets }} />
                <span className="whitespace-nowrap">Big Bets</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS.line_extensions }} />
                <span className="whitespace-nowrap">Line Extensions</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS.ltos }} />
                <span className="whitespace-nowrap">LTOs</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS.other }} />
                <span className="whitespace-nowrap">Other</span>
              </div>
            </div>
          </div>
          
          {/* Chart Container - Responsive Height */}
          <ResponsiveContainer width="100%" height={400} className="sm:!h-[500px] md:!h-[600px] lg:!h-[650px]">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Value" 
                domain={[0, 10]}
                label={{ value: 'Value Score (Higher →)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Risk" 
                domain={[0, 10]}
                label={{ value: '← Lower Risk', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={5} stroke="#ccc" strokeDasharray="5 5" />
              <ReferenceLine y={5} stroke="#ccc" strokeDasharray="5 5" />
              <Scatter data={data}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* NPV Legend - Responsive */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">&lt; $1M NPV</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">$1M-$5M NPV</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border border-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">&gt; $5M NPV</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
