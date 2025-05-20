import { useCallback, useRef, useState } from 'react'
import '@xyflow/react/dist/style.css'
import {
  addEdge,
  Background,
  type Connection,
  ConnectionLineType,
  Controls,
  type Edge,
  getOutgoers,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'

import { Button } from '@/components/ui/button.tsx'
import { Plus, Trash } from 'lucide-react'
import { QuestionNode } from './QuestionNode.tsx'
import { ChoiceNode } from './ChoiceNode.tsx'
import { ButtonEdge } from './ButtonEdge.tsx'
import type { AppNodes, ChoiceNodeData, QuestionNodeData } from '../types'
import { getId, getLayoutedElements, nodeWidth } from '../lib'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'

type DialogContent = {
  title: string
  description: string
}

const nodeTypes = {
  question: QuestionNode,
  choice: ChoiceNode,
}

const edgeTypes = {
  button: ButtonEdge,
}

export function DiagramBuilder() {
  const initialNodes: AppNodes = []
  const initialEdges: Edge[] = []

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { getNodes, getEdges, fitView } = useReactFlow()

  const isEmpty = nodes.length === 0
  console.log('Render DiagramBuilder:', nodes, edges)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const dialogContentRef = useRef<DialogContent>(null)
  if (!dialogOpen && dialogContentRef.current) {
    // чтобы избежать мерцания удаляемого текста, поскольку закрытие происходит с анимацией 150 ms
    setTimeout(() => {
      dialogContentRef.current = null
    }, 150)
  }

  const showDialog = (content: DialogContent) => {
    setDialogOpen(true)
    dialogContentRef.current = content
  }

  const onConnect = useCallback(
    (connection: Connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes()
      const edges = getEdges()

      const source = connection.source
      const target = connection.target

      if (!source || !target || source === target) return

      const sourceNode = nodes.find((node) => node.id === source)
      const targetNode = nodes.find((node) => node.id === target)

      if (!sourceNode || !targetNode) return

      // Нельзя соединять ответ → ответ
      if (sourceNode.type === 'choice' && targetNode.type === 'choice') {
        showDialog({
          title: 'Действие недопустимо!',
          description:
            'Нельзя соединять варианты ответа друг с другом. Варианты ответов допустимо соединять только с вопросами.',
        })
        return
      }

      // нельзя соединять вопрос → вопрос, если уже есть вопрос → ответ
      if (sourceNode.type === 'question' && targetNode.type === 'question') {
        const notAllowed = edges.some(
          (e) =>
            e.source === source &&
            nodes.find((n) => n.id === e.target)?.type === 'choice'
        )
        if (notAllowed) {
          showDialog({
            title: 'Действие недопустимо!',
            description:
              'Нельзя соединить вопрос с другим вопросом, если уже есть связь с ответом.',
          })
          return
        }
      }

      // нельзя соединять вопрос → ответ, если уже есть вопрос → вопрос
      if (sourceNode.type === 'question' && targetNode.type === 'choice') {
        const hasQuestionConnection = edges.some(
          (e) =>
            e.source === source &&
            nodes.find((n) => n.id === e.target)?.type === 'question'
        )
        if (hasQuestionConnection) {
          showDialog({
            title: 'Действие недопустимо',
            description:
              'Нельзя соединить вопрос с ответом, если уже есть связь с другим вопросом.',
          })
          return
        }
      }

      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            // markerEnd: {
            //     type: MarkerType.ArrowClosed,
            // },
            type: 'button',
            data: {
              setEdges,
            },
          },
          edges
        )
      )
    },
    [getNodes, getEdges]
  )

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes()
      const edges = getEdges()
      const target = nodes.find((node) => node.id === connection.target)

      if (!target) {
        return false
      }

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false

        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
      }

      if (target?.id === connection.source) return false
      return !hasCycle(target)
    },
    [getNodes, getEdges]
  )

  const addQuestionNode = () => {
    setNodes((nodes) => {
      const hasQuestionNode = nodes.some((node) => node.type === 'question')
      const lastNode = nodes[nodes.length - 1]

      const newQuestionNode: Node<QuestionNodeData> = {
        id: getId(),
        type: 'question',
        position: {
          x: (lastNode?.position?.x ?? 0) + (lastNode?.width ?? nodeWidth),
          y: lastNode?.position?.y ?? 0,
        },
        data: {
          isStartNode: !hasQuestionNode,
          questionDefault: '',
          responseTextDefault: '',
          onlyChoicesDefault: true,
        },
      }

      return [...nodes, newQuestionNode]
    })
  }

  const addChoiceNode = () => {
    setNodes((nodes) => {
      const lastNode = nodes[nodes.length - 1]

      const newChoiceNode: Node<ChoiceNodeData> = {
        id: getId(),
        type: 'choice',
        position: {
          x: (lastNode?.position?.x ?? 0) + (lastNode?.width ?? nodeWidth),
          y: lastNode?.position?.y ?? 0,
        },
        data: {
          choiceTextDefault: '',
          responseTextDefault: '',
          requestContactDefault: false,
        },
      }

      return [...nodes, newChoiceNode]
    })
  }

  const clear = () => {
    setNodes([])
    setEdges([])
  }

  const onLayout = (direction: string) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    )
    // fitView({nodes: layoutedNodes})
    setNodes([...layoutedNodes])
    setEdges([...layoutedEdges])
    setTimeout(() => fitView({ includeHiddenNodes: true }), 0)
  }

  return (
    <>
      <div className="h-screen w-full flex flex-col">
        <div className="p-4 flex gap-2 bg-gray-100 border-b">
          <Button onClick={addQuestionNode} variant="default">
            <Plus className="w-4 h-4" /> Добавить вопрос
          </Button>
          <Button onClick={addChoiceNode} variant="outline">
            <Plus className="w-4 h-4" /> Добавить вариант ответа
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isEmpty}>
                <Trash className="w-4 h-4" /> Очистить холст
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Вы точно уверены?</DialogTitle>
                <DialogDescription>
                  Это действие приведет к полному удалению всех элементов на
                  холсте и его нельзя отменить.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant={'destructive'} onClick={clear}>
                    Удалить
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button">Отмена</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1">
          <>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              connectionLineType={ConnectionLineType.SimpleBezier} // TODO
              style={{ backgroundColor: '#F7F9FB' }}
              minZoom={0.2}
            >
              <Panel position="top-right">
                <Button variant={'outline'} onClick={() => onLayout('TB')}>
                  Вертикально
                </Button>
                <Button variant={'outline'} onClick={() => onLayout('LR')}>
                  Горизонтально
                </Button>
              </Panel>
              <MiniMap />
              <Controls />
              <Background gap={12} />
            </ReactFlow>
          </>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialogContentRef?.current?.title}</DialogTitle>
                <DialogDescription>
                  {dialogContentRef?.current?.description}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button">Понятно</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
