import { Card, CardContent } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import {
  GripHorizontal,
  Info,
  MessageSquareMore,
  Plus,
  Trash,
  X,
} from 'lucide-react'
import { AddButton } from '@/features/tg-bot-builder-form/ui/add-button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useId } from 'react'
import type {
  ChoiceType,
  QuestionType,
} from '@/features/tg-bot-builder-form/ui/form-builder.tsx'
import { cn } from '@/lib/utils.ts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
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
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  type DraggableAttributes,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { SortableChoice } from './sortable-choice'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities' // создадим

type QuestionProps = {
  addChoice: (id: string) => void
  removeQuestion: (name: string) => void
  question: QuestionType
  removeChoice: (questionId: string, choiceId: string) => void
  toggleOnlyChoices: (name: string, onlyChoices: boolean) => void
  setChoices: (name: string, onlyChoices: ChoiceType[]) => void
}

type D = {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
}

const Question = ({
  addChoice,
  question,
  removeQuestion,
  removeChoice,
  toggleOnlyChoices,
  setChoices,
  attributes,
  listeners,
}: QuestionProps & D) => {
  const sensors = useSensors(useSensor(PointerSensor))
  const id = useId()

  const handleChoiceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = question.choices.findIndex((c) => c.id === active.id)
      const newIndex = question.choices.findIndex((c) => c.id === over?.id)

      const newChoices = arrayMove(question.choices, oldIndex, newIndex)

      setChoices(question.name, newChoices)
    }
  }

  return (
    <Card className={'pt-0 pb-3'}>
      <CardContent className={'px-3'}>
        <div
          {...listeners}
          {...attributes}
          className="cursor-move flex justify-center items-center h-6"
          aria-label="Переместить вопрос"
        >
          <GripHorizontal className={'size-4'} />
        </div>

        <div className="flex justify-between items-center mb-2 space-x-[15%]">
          <Textarea
            placeholder="Введите текст вопроса"
            className="resize-none py-2 min-h-9"
          />

          <Dialog>
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        className={'rounded-full shrink-0'}
                        variant="ghost"
                        aria-label="Удалить вопрос"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Удалить вопрос</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Вы точно уверены?</DialogTitle>
                <DialogDescription>
                  Это действие приведет к удалению вопроса, а также всех данных,
                  связанных с этим вопросом.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant={'destructive'}
                    onClick={() => removeQuestion(question.name)}
                  >
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

        <div className={'mt-4 mb-6 md:ml-[30%] ml-[20%]'}>
          {/*{question.choices.map((choice) => {*/}
          {/*  return (*/}
          {/*    <div*/}
          {/*      className={'flex justify-between items-center mb-2 space-x-1'}*/}
          {/*      key={choice.id}*/}
          {/*    >*/}
          {/*      <Textarea*/}
          {/*        defaultValue={choice.text}*/}
          {/*        placeholder="Укажите вариант ответа"*/}
          {/*        className="resize-none py-2 min-h-9"*/}
          {/*      />*/}
          {/*      <Button*/}
          {/*        size={'icon'}*/}
          {/*        className={'rounded-full shrink-0'}*/}
          {/*        variant="ghost"*/}
          {/*        onClick={() => removeChoice(question.name, choice.id)}*/}
          {/*        aria-label="Удалить вариант ответа"*/}
          {/*      >*/}
          {/*        <X className="w-4 h-4" />*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  )*/}
          {/*})}*/}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleChoiceDragEnd}
          >
            <SortableContext
              items={question.choices.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {question.choices.map((choice) => (
                <SortableChoice
                  key={choice.id}
                  id={choice.id}
                  choice={choice}
                  questionName={question.name}
                  onRemove={() => removeChoice(question.name, choice.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {question.only_choices && (
            <div className={'flex justify-between items-center mb-2 space-x-1'}>
              <Textarea
                defaultValue={'Другое'}
                className="resize-none py-2 min-h-9 disabled:select-none disabled:pointer-events-none"
                disabled
              />
              <Button
                size={'icon'}
                className={'rounded-full shrink-0'}
                variant="ghost"
                onClick={() =>
                  toggleOnlyChoices(question.name, !question.only_choices)
                }
                aria-label="Удалить ответ свободной форме"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div
            className={cn([
              'flex justify-between items-center mb-2 space-x-1',
              question.only_choices && 'pr-10',
            ])}
          >
            <AddButton
              className={'md:py-2 rounded-md py-2.5'}
              onClick={() => addChoice(question.name)}
            >
              <Plus className="w-4 h-4" />
              Добавить вариант ответа
            </AddButton>

            {question.choices.length > 0 && !question.only_choices && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AddButton
                      className={
                        'md:py-2 md:size-9 rounded-md py-2.5 size-9 shrink-0 h-10'
                      }
                      aria-label="Разрешить кандидату написать свой вариант ответа"
                      onClick={() =>
                        toggleOnlyChoices(question.name, !question.only_choices)
                      }
                    >
                      <MessageSquareMore className="w-4 h-4" />
                    </AddButton>
                  </TooltipTrigger>
                  <TooltipContent side={'bottom'} className={'max-w-[330px]'}>
                    Разрешить кандидату написать свой вариант ответа
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pb-1 pt-4">
          <Label htmlFor={id} className={'text-sm'}>
            Комментарий для AI (опционально)
          </Label>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent className={'max-w-[260px] text-pretty'}>
                Здесь указывается промт для AI, который проанализирует,
                соответствует ли ответ кандидата требованиям вакансии
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          id={id}
          placeholder="Например - Подходят только кандидаты с опытом коммерческой разработки более 2-х лет"
          className="resize-none py-1.5 min-h-16 md:min-h-14"
        />
      </CardContent>
    </Card>
  )
}

export { Question, type QuestionProps }
