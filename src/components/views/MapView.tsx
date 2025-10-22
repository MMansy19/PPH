'use client'
import React from 'react'
import { ReactFlow, Background, Controls, MiniMap, Panel } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useReactFlowData } from '@/hooks/useReactFlow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORY_COLORS } from '@/lib/utils'

export function MapView() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useReactFlowData()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Process Map View</span>
          <span className="text-sm font-normal text-gray-500">
            (Drag nodes • Connect edges • Zoom/Pan)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[700px] border rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                return node.style?.background as string || '#ccc'
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
            <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-md">
              <div className="space-y-1 text-xs">
                <p className="font-semibold mb-2">Legend:</p>
                {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  )
}
