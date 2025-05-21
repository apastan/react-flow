import { Card, CardContent } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Info, MessageSquareMore, Plus, Trash, X } from 'lucide-react'
import { AddButton } from '@/features/tg-bot-builder-form/ui/add-button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useId } from 'react'
import type { QuestionType } from '@/features/tg-bot-builder-form/ui/form-builder.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { cn } from '@/lib/utils.ts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'

type QuestionProps = {
  addChoice: (id: string) => void
  removeQuestion: (name: string) => void
  question: QuestionType
  removeChoice: (questionId: string, choiceId: string) => void
}

export const Question = ({
  addChoice,
  question,
  removeQuestion,
  removeChoice,
}: QuestionProps) => {
  const id = useId()

  return (
    <Card className={'py-2'}>
      <CardContent className={'px-3'}>
        <div className="flex justify-between items-center mb-2 space-x-[15%]">
          <Textarea
            placeholder="Введите текст вопроса"
            className="resize-none py-2 min-h-9"
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={'rounded-full shrink-0'}
                  variant="ghost"
                  onClick={() => removeQuestion(question.name)}
                  aria-label="Удалить вопрос"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Удалить вопрос</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className={'mt-4 mb-6 md:ml-[30%] ml-[20%]'}>
          {question.choices.map((choice) => {
            return (
              <div
                className={'flex justify-between items-center mb-2 space-x-1'}
                key={choice.id}
              >
                <Textarea
                  defaultValue={choice.text}
                  placeholder="Укажите вариант ответа"
                  className="resize-none py-2 min-h-9"
                />
                <Button
                  size={'icon'}
                  className={'rounded-full shrink-0'}
                  variant="ghost"
                  onClick={() => removeChoice(question.name, choice.id)}
                  aria-label="Удалить вариант ответа"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
          <div
            className={cn(['flex justify-between items-center mb-2 space-x-1'])}
          >
            <AddButton
              className={'md:py-2 rounded-md py-2.5'}
              onClick={() => addChoice(question.name)}
            >
              <Plus className="w-4 h-4" />
              Добавить вариант ответа
            </AddButton>

            {question.choices.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AddButton
                      className={
                        'md:py-2 md:size-9 rounded-md py-2.5 size-9 shrink-0 h-10'
                      }
                      aria-label="Разрешить ответ в свободной форме"
                    >
                      <MessageSquareMore className="w-4 h-4" />
                    </AddButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    Разрешить ответ в свободной форме
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pb-1">
          <Label htmlFor={id} className={'text-sm'}>
            AI Комментарий
          </Label>

          <Popover>
            <PopoverTrigger className={'cursor-pointer'}>
              <Info className="size-4" />
            </PopoverTrigger>
            <PopoverContent className={'text-sm'}>
              Это текст для AI, на основании которого AI принимается решение,
              соответствует ли ответ кандидата на данный вопрос требованиям
              вакансии
            </PopoverContent>
          </Popover>
        </div>
        <Textarea
          id={id}
          placeholder="Введите комментарий для AI"
          className="resize-none py-1.5 mb-2 min-h-16 md:min-h-14"
        />
      </CardContent>
    </Card>
  )
}
