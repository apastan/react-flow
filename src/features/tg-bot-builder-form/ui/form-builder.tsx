import { useState } from 'react'
import { Question } from '@/features/tg-bot-builder-form/ui/question.tsx'
import { Button } from '@/components/ui/button.tsx'

export const FormBuilder = () => {
  const isLoading = false
  const initialQuestions = [1, 2, 3]
  const [questions, setQuestions] = useState<number[]>([])
  const hasQuestions = questions.length

  const addQuestion = () => {
    setQuestions((state) => [...state, state.length])
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-1/2 mx-auto">
      {hasQuestions ? (
        questions.map((question) => {
          return <Question />
        })
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
