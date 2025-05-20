import dagre from '@dagrejs/dagre'
import { type Edge, Position, type XYPosition } from '@xyflow/react'
import type { AppNodes } from '@/features/telegram-bot-builder/types'

export const nodeWidth = 300
export const nodeHeight = 230

export const getLayoutedElements = (
  nodes: AppNodes,
  edges: Edge[],
  direction = 'TB'
) => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes: AppNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    const positions: {
      targetPosition: Position
      sourcePosition: Position
      position: XYPosition
    } = {
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }

    const newNode = {
      ...node,
      ...positions,
    }

    return newNode
  }) as AppNodes

  return { nodes: newNodes, edges }
}
