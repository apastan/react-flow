import { useCallback, useRef, useState } from 'react'
import '@xyflow/react/dist/style.css'
import {
  addEdge,
  Background,
  type Connection,
  ConnectionLineType,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'

import { Button } from '@/components/ui/button.tsx'
import { Plus, Trash } from 'lucide-react'
import { QuestionNode } from './QuestionNode.tsx'
import { ChoiceNode } from './ChoiceNode.tsx'
import { ButtonEdge } from './ButtonEdge.tsx'
import type {
  AppNodes,
  ChoiceNodeData,
  QuestionNodeData,
  QuestionNodeType,
} from '../types'
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
          },
          edges
        )
      )
    },
    [nodes, edges]
  )

  const updateStartNodeId = (id: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.type === 'question' && 'isStartNode' in node.data) {
          return {
            ...node,
            data: {
              ...node.data,
              isStartNode: node.id === id,
            },
          }
        }

        return node
      })
    )
  }

  const removeNode = (id: string) => {
    setNodes((nodes) => {
      const startNode = nodes.find(
        (node) => node.id === id && node.type === 'question'
      )
      // TODO - refactor - get rid of assertion
      if ((startNode as QuestionNodeType | undefined)?.data?.isStartNode) {
        showDialog({
          title: 'Будьте внимательны',
          description:
            'Вы удалили стартовый вопрос - обязательно выберите один из вопроса в качестве в качестве стартового.',
        })
      }
      // TODO - refactor - O(n)
      return nodes.filter((node) => node.id !== id)
    })
  }

  const addQuestionNode = () => {
    const newId = getId()

    setNodes((nodes) => {
      const hasQuestionNode = nodes.some((node) => node.type === 'question')

      const newQuestionNode: Node<QuestionNodeData> = {
        id: newId,
        type: 'question',
        position: { x: 100, y: 100 },
        data: {
          isStartNode: !hasQuestionNode,
          updateStartNodeId,
          questionDefault: '',
          responseTextDefault: '',
          onlyChoicesDefault: true,
          removeNode: removeNode,
        },
      }

      return [...nodes, newQuestionNode]
    })
  }

  const addChoiceNode = () => {
    const newId = getId()

    setNodes((nodes) => {
      const lastNode = nodes[nodes.length - 1]

      const position = {
        x: (lastNode?.position?.x ?? 0) + (lastNode?.width ?? nodeWidth),
        y: lastNode?.position?.y ?? 0,
      }

      const newChoiceNode: Node<ChoiceNodeData> = {
        id: newId,
        type: 'choice',
        position: position,
        data: {
          choiceTextDefault: '',
          responseTextDefault: '',
          requestContactDefault: false,
          removeNode: removeNode,
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

    setNodes([...layoutedNodes])
    setEdges([...layoutedEdges])
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
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              connectionLineType={ConnectionLineType.SimpleBezier} // TODO
              style={{ backgroundColor: '#F7F9FB' }}
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
          </ReactFlowProvider>

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
