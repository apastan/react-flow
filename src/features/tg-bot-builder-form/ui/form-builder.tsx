import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { AddButton } from './add-button.tsx'
import { Plus } from 'lucide-react'
import { getId } from '@/features/telegram-bot-builder/lib'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableQuestion } from '@/features/tg-bot-builder-form/ui/sortable-question.tsx'

export type ChoiceType = {
  id: string
  text: string
}

export type QuestionType = {
  name: string
  question: string
  choices: ChoiceType[]
  only_choices?: boolean
  gpt: string
}

export const FormBuilder = () => {
  const isLoading = false
  const initialQuestions: QuestionType[] = []
  const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions)
  const hasQuestions = questions.length > 0
  console.log(questions)
  const sensors = useSensors(useSensor(PointerSensor))

  const addQuestion = () => {
    setQuestions((state) => {
      const newQuestion: QuestionType = {
        name: getId(),
        question: '',
        choices: [],
        only_choices: false,
        gpt: '',
      }

      return [...state, newQuestion]
    })
  }

  const addChoice = (questionId: string) => {
    setQuestions((state) => {
      const newChoice: ChoiceType = {
        id: getId(),
        text: '',
      }

      return state.map((q) =>
        q.name === questionId ? { ...q, choices: [...q.choices, newChoice] } : q
      )
    })
  }

  const removeQuestion = (name: string) => {
    setQuestions((state) => {
      return state.filter((q) => q.name !== name)
    })
  }

  const removeChoice = (questionName: string, choiceId: string) => {
    setQuestions((state) => {
      return state.map((q) => {
        // if (q.name === questionName && q.choices.length === 1) {
        //   toggleOnlyChoices(questionName, false)
        // }

        return q.name === questionName
          ? {
              ...q,
              choices: q.choices.filter((c) => c.id !== choiceId),
              only_choices: q.choices.length === 1 ? false : q.only_choices,
            }
          : q
      })
    })
  }

  const toggleOnlyChoices = (questionName: string, onlyChoices: boolean) => {
    setQuestions((state) =>
      state.map((q) =>
        q.name === questionName ? { ...q, only_choices: onlyChoices } : q
      )
    )
  }

  const handleDragEndQuestion = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((q) => q.name === active.id)
        const newIndex = items.findIndex((q) => q.name === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const setChoices = (questionName: string, newChoices: ChoiceType[]) => {
    setQuestions((items) =>
      items.map((q) =>
        q.name === questionName ? { ...q, choices: newChoices } : q
      )
    )
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-[800px] mx-auto p-4">
      {hasQuestions ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndQuestion}
        >
          <SortableContext
            items={questions.map((q) => q.name)}
            strategy={verticalListSortingStrategy}
          >
            <div className={'flex flex-col space-y-4 mb-4'}>
              {questions.map((question) => {
                return (
                  // <Question
                  //   key={question.name}
                  //   addChoice={addChoice}
                  //   question={question}
                  //   removeChoice={removeChoice}
                  //   removeQuestion={removeQuestion}
                  //   toggleOnlyChoices={toggleOnlyChoices}
                  // />
                  <SortableQuestion
                    key={question.name}
                    id={question.name}
                    question={question}
                    addChoice={addChoice}
                    removeChoice={removeChoice}
                    removeQuestion={removeQuestion}
                    toggleOnlyChoices={toggleOnlyChoices}
                    setChoices={setChoices}
                  />
                )
              })}
            </div>
            <AddButton onClick={addQuestion}>
              <Plus className="w-4 h-4" />
              Добавить вопрос
            </AddButton>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={'h-screen flex justify-center items-center'}>
          <Button type={'button'} onClick={addQuestion}>
            Создать первый вопрос
          </Button>
        </div>
      )}
    </div>
  )
}
