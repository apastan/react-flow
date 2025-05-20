import { memo, useRef, useState } from 'react'
import { Handle, type NodeProps, Position, useReactFlow } from '@xyflow/react'
import { Button } from '@/components/ui/button.tsx'
import {
  Crown,
  Info,
  MessageCircleReply,
  MoreVertical,
  Trash,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import type { QuestionNodeType } from '../types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { useDeleteNodeEdges } from '@/features/telegram-bot-builder/hooks'

const handleStyles = {
  background: 'white',
  height: '25px',
  width: '25px',
  border: '1px solid var(--xy-edge-stroke-default)',
}

const ONLY_CHOICES_DEFAULT_VALUE = false

export const QuestionNode = memo((props: NodeProps<QuestionNodeType>) => {
  const {
    id,
    data,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
  } = props
  const {
    isStartNode,
    questionDefault,
    responseTextDefault,
    onlyChoicesDefault,
  } = data
  console.log(`Render QuestionNode ${id}`)
  const { getEdges, getNodes, setNodes } = useReactFlow()

  const [showResponse, setShowResponse] =
    useState<boolean>(!!responseTextDefault)

  const questionElementRef = useRef<HTMLTextAreaElement>(null)
  const responseInitialValue = useRef(responseTextDefault)
  const responseElementRef = useRef<HTMLTextAreaElement>(null)
  const onlyChoicesInitialValue = useRef(
    onlyChoicesDefault ?? ONLY_CHOICES_DEFAULT_VALUE
  )
  const onlyChoicesElementRef = useRef<HTMLButtonElement>(null)

  const connections = getEdges().filter((edge) => edge.source === id)
  const hasConnectionWithChoiceNode = connections.some(
    (edge) =>
      getNodes().find((node) => node.id === edge.target)?.type === 'choice'
  )

  if (!hasConnectionWithChoiceNode) {
    onlyChoicesInitialValue.current = ONLY_CHOICES_DEFAULT_VALUE
  }

  const handleToggleResponse = () => {
    setShowResponse((state) => {
      if (state) {
        if (responseElementRef.current) {
          responseElementRef.current.value = ''
        }
        responseInitialValue.current = ''
      }
      return !state
    })
  }

  const handleUpdateStartNode = (id: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.type === 'question' && 'isStartNode' in node.data) {
          const shouldBeStart = node.id === id
          const isCurrentlyStart = node.data.isStartNode === true

          if (shouldBeStart !== isCurrentlyStart) {
            return {
              ...node,
              data: {
                ...node.data,
                isStartNode: shouldBeStart,
              },
            }
          }
        }

        return node
      })
    )
  }

  const { removeNodeEdges } = useDeleteNodeEdges()

  return (
    <div className="bg-[#f8f8f8] border border-gray-400 rounded-lg shadow-md p-2 w-72">
      <Handle type="target" position={targetPosition} style={handleStyles} />
      <div className="flex justify-between items-center mb-2">
        <div className={'flex'}>
          <span className={'flex justify-center items-center mr-1'}>
            {isStartNode && (
              // <Network className="w-4 h-4 text-amber-600"/>
              <Crown className="w-4 h-4 text-amber-600" />
            )}
          </span>
          <span className="font-semibold text-sm mr-1">
            {isStartNode ? 'Стартовый вопрос' : 'Вопрос'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className={'hover:bg-input/50'} variant="ghost">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleToggleResponse}>
                  <MessageCircleReply className="w-4 h-4" />
                  {showResponse ? 'Удалить' : 'Добавить'} Response
                </DropdownMenuItem>
                {!isStartNode && (
                  <DropdownMenuItem onClick={() => handleUpdateStartNode(id)}>
                    <Crown className="w-4 h-4" />
                    Сделать стартовым
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => removeNodeEdges(id)}>
                  <Trash className="w-4 h-4" />
                  Удалить вопрос
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-2">
        <Textarea
          defaultValue={questionDefault}
          placeholder="Введите текст вопроса"
          className="text-sm px-1.5 py-0 resize-none"
          ref={questionElementRef}
        />
      </div>
      <div className="mb-2">
        {showResponse && (
          <Textarea
            defaultValue={responseInitialValue.current}
            placeholder="Response (необязательно)"
            className="text-sm px-1.5 py-0 resize-none"
            ref={responseElementRef}
          />
        )}
      </div>
      {hasConnectionWithChoiceNode && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`only_choices_${id}`}
            defaultChecked={onlyChoicesInitialValue.current}
            ref={onlyChoicesElementRef}
          />
          <label htmlFor={`only_choices_${id}`} className="text-sm">
            Только выбор из вариантов
          </label>
          <Popover>
            <PopoverTrigger
              className={
                'hover:outline-3 focus:outline-3 rounded-full outline-gray-200 hover:cursor-pointer'
              }
            >
              <Info className="size-4" />
            </PopoverTrigger>
            <PopoverContent className={'text-sm'}>
              Если данный чекбокс выбран, то пользователь не сможет дать ответ в
              свободной форме, а сможет только выбрать один из предложенных
              вариантов ответа.
            </PopoverContent>
          </Popover>
        </div>
      )}
      <Handle type="source" position={sourcePosition} style={handleStyles} />
    </div>
  )
})

QuestionNode.displayName = 'QuestionNode'
