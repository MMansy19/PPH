'use client'
import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts'
import { useTasksStore } from '@/store/useTasksStore'
import { Card, CardContent } from '@/components/ui/card'
import { CATEGORY_COLORS } from '@/lib/utils'
import { BubbleData } from '@/types'

export function PortfolioBubbleChart() {
  const { tasks } = useTasksStore()

  const data: BubbleData[] = tasks.map(task => ({
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
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Prioritized Process Portfolio</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.big_bets }} />
                <span>Big Bets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.line_extensions }} />
                <span>Line Extensions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.ltos }} />
                <span>LTOs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.other }} />
                <span>Other</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={600}>
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

          <div className="flex justify-end gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-gray-400" />
              <span>&lt; $1M NPV</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-gray-400" />
              <span>$1M-$5M NPV</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-gray-400" />
              <span>&gt; $5M NPV</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
