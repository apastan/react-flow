import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react'
import { Button } from '@/components/ui/button.tsx'

export function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            pointerEvents: 'all',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            transformOrigin: 'center',
          }}
        >
          <Button
            className={
              'size-9 border border-s border-solid text-[var(--xy-edge-node-color-default)] bg-neutral-100 border-[var(--xy-edge-stroke-default)] cursor-pointer rounded-full text-base hover:bg-neutral-200'
            }
            onClick={onEdgeClick}
            aria-label={'Удалить связь'}
          >
            ×
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
