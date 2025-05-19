import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'

export const useDeleteNodeEdges = () => {
  const { setNodes, setEdges } = useReactFlow()

  const removeNodeEdges = useCallback(
    (nodeId: string) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId))
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      )
    },
    [setNodes, setEdges]
  )

  return { removeNodeEdges }
}
