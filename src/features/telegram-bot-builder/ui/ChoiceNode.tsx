import { memo, useRef, useState } from 'react'
import { Handle, type NodeProps, Position } from '@xyflow/react'
import { Button } from '@/components/ui/button.tsx'
import { MessageCircleReply, MoreVertical, Trash } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import type { ChoiceNodeType } from '../types'
import { useDeleteNodeEdges } from '@/features/telegram-bot-builder/hooks'

const handleStyles = {
  background: 'white',
  height: '25px',
  width: '25px',
  border: '1px solid var(--xy-edge-stroke-default)',
}

export const ChoiceNode = memo((props: NodeProps<ChoiceNodeType>) => {
  const {
    id,
    data,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
  } = props
  const { choiceTextDefault, responseTextDefault, requestContactDefault } = data
  console.log(`Render ChoiceNode ${id}`)

  const [showResponse, setShowResponse] =
    useState<boolean>(!!responseTextDefault)

  const choiceTextRef = useRef<HTMLTextAreaElement>(null)
  const responseTextInitial = useRef(responseTextDefault)
  const responseTextRef = useRef<HTMLTextAreaElement>(null)
  const requestContactRef = useRef<HTMLButtonElement>(null)

  const handleToggleResponse = () => {
    setShowResponse((state) => {
      if (state) {
        if (responseTextRef.current) {
          responseTextRef.current.value = ''
        }
        responseTextInitial.current = ''
      }
      return !state
    })
  }

  const { removeNodeEdges } = useDeleteNodeEdges()

  return (
    <div className="bg-[white] border border-gray-300 rounded-lg shadow-md p-2 w-72">
      <Handle type="target" position={targetPosition} style={handleStyles} />
      {/*--xy-handle-background-color*/}
      {/*--xy-handle-border-color is not defined*/}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">Вариант ответа</span>
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
              <DropdownMenuItem onClick={() => removeNodeEdges(id)}>
                <Trash className="w-4 h-4" />
                Удалить ответ
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-2">
        <Textarea
          defaultValue={choiceTextDefault}
          ref={choiceTextRef}
          placeholder="Введите текст ответа"
          className="text-sm px-1.5 py-0 resize-none"
        />
      </div>
      <div className="mb-2">
        {showResponse && (
          <Textarea
            defaultValue={responseTextInitial.current}
            placeholder="Response (необязательно)"
            className="text-sm px-1.5 py-0 resize-none"
            ref={responseTextRef}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`request_contact_${id}`}
          defaultChecked={requestContactDefault}
          ref={requestContactRef}
        />
        <label htmlFor={`request_contact_${id}`} className="text-sm">
          Запросить контакт
        </label>
      </div>
      <Handle type="source" position={sourcePosition} style={handleStyles} />
    </div>
  )
})

ChoiceNode.displayName = 'ChoiceNode'
