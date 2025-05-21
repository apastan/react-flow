import { useState } from 'react'
import { Question } from './question'
import { Button } from '@/components/ui/button.tsx'
import { AddButton } from './add-button.tsx'
import { Plus } from 'lucide-react'
import { getId } from '@/features/telegram-bot-builder/lib'

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
  const initialQuestions = []
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const hasQuestions = questions.length > 0
  console.log(questions)

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
      return state.map((q) =>
        q.name === questionName
          ? { ...q, choices: q.choices.filter((c) => c.id !== choiceId) }
          : q
      )
    })
  }

  const toggleOnlyChoices = (questionName: string) => {
    setQuestions((state) =>
      state.map((q) =>
        q.name === questionName ? { ...q, only_choices: !q.only_choices } : q
      )
    )
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-[800px] mx-auto p-4">
      {hasQuestions ? (
        <>
          <div className={'flex flex-col space-y-4 mb-4'}>
            {questions.map((question) => {
              return (
                <Question
                  key={question.name}
                  addChoice={addChoice}
                  question={question}
                  removeChoice={removeChoice}
                  removeQuestion={removeQuestion}
                  toggleOnlyChoices={toggleOnlyChoices}
                />
              )
            })}
          </div>
          <AddButton onClick={addQuestion}>
            <Plus className="w-4 h-4" />
            Добавить вопрос
          </AddButton>
        </>
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
