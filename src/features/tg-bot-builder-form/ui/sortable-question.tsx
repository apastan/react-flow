import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Question, type QuestionProps } from './question'

type SortableQuestionProps = { id: string } & QuestionProps

export const SortableQuestion = ({ id, ...props }: SortableQuestionProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto',
  }

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <Question {...props} attributes={attributes} listeners={listeners} />
      </div>
    </>
  )
}
