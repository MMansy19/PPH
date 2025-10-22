'use client'
import { useCallback, useMemo } from 'react'
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react'
import { useTasksStore } from '@/store/useTasksStore'
import { CATEGORY_COLORS } from '@/lib/utils'

export function useReactFlowData() {
  const { tasks } = useTasksStore()
  
  const initialNodes: Node[] = useMemo(() => {
    return tasks.map((task, idx) => ({
      id: task.id,
      type: 'default',
      data: { 
        label: `${task.title}\n(${task.duration})`,
      },
      position: { 
        x: (task.value || 5) * 80 + (idx % 3) * 50, 
        y: (task.risk || 5) * 60 + Math.floor(idx / 3) * 80
      },
      style: {
        background: CATEGORY_COLORS[task.category || 'other'],
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        border: '2px solid white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
    }))
  }, [tasks])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  )

  return { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    setNodes,
    setEdges
  }
}
