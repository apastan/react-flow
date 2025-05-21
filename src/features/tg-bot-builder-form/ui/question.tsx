import { Card, CardContent } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Info, Plus, Trash, X } from 'lucide-react'
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

          <Button
            className={'rounded-full shrink-0'}
            variant="ghost"
            onClick={() => removeQuestion(question.name)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>

        <div className={'mt-4 mb-6 ml-60'}>
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
                  className={'rounded-full shrink-0 '}
                  variant="ghost"
                  onClick={() => removeChoice(question.name, choice.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
          <div className={cn([question.choices.length > 0 ? 'pr-10' : ''])}>
            <AddButton
              className={'py-2 rounded-md'}
              onClick={() => addChoice(question.name)}
            >
              <Plus className="w-4 h-4" />
              Добавить вариант ответа
            </AddButton>
          </div>
        </div>

        <div className="flex items-center space-x-2  pb-1">
          <Label htmlFor={id} className={'text-sm'}>
            AI Комментарий
          </Label>

          <Popover>
            <PopoverTrigger className={'cursor-pointer'}>
              <Info className="size-4" />
            </PopoverTrigger>
            <PopoverContent className={'text-sm'}>
              Это текст для AI, на основании которого AI принимается решение,
              соответствует ли ответ кандидата требованиям
            </PopoverContent>
          </Popover>
        </div>
        <Textarea
          id={id}
          placeholder="Введите комментарий"
          className="resize-none py-2 mb-2"
        />
      </CardContent>
    </Card>
  )
}
