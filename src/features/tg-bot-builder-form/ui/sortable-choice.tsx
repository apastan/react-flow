import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { GripVertical, X } from 'lucide-react'
import type { ChoiceType } from '@/features/tg-bot-builder-form/ui/form-builder.tsx'

type SortableChoiceProps = {
  id: string
  choice: ChoiceType
  questionName: string
  onRemove: (questionId: string, choiceId: string) => void
}

export const SortableChoice = ({
  id,
  choice,
  onRemove,
  questionName,
}: SortableChoiceProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex justify-between items-center mb-2 space-x-1 relative"
    >
      <div
        {...listeners}
        {...attributes}
        className="flex justify-center items-center size-6 absolute -left-6 cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-15"
        aria-label="Переместить вопрос"
      >
        <GripVertical className={'size-4'} />
      </div>
      <Textarea
        defaultValue={choice.text}
        placeholder="Укажите вариант ответа"
        className="resize-none py-2 min-h-9 bg-card"
      />
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full shrink-0"
        onClick={() => onRemove(questionName, choice.id)}
        aria-label="Удалить вариант ответа"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

// const s = (
//   <div
//     className={'flex justify-between items-center mb-2 space-x-1'}
//     key={choice.id}
//   >
//     <Textarea
//       defaultValue={choice.text}
//       placeholder="Укажите вариант ответа"
//       className="resize-none py-2 min-h-9"
//     />
//     <Button
//       size={'icon'}
//       className={'rounded-full shrink-0'}
//       variant="ghost"
//       onClick={() => removeChoice(question.name, choice.id)}
//       aria-label="Удалить вариант ответа"
//     >
//       <X className="w-4 h-4" />
//     </Button>
//   </div>
// )
