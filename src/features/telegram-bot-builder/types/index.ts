import type { Node } from '@xyflow/react'

export type QuestionNodeData = {
  isStartNode: boolean
  questionDefault: string
  responseTextDefault: string
  onlyChoicesDefault: boolean
  removeNode: (id: string, isStartNode?: boolean) => void
  updateStartNode: (id: string) => void
}

export type ChoiceNodeData = {
  choiceTextDefault: string
  responseTextDefault: string
  requestContactDefault: boolean
  removeNode: (id: string, isStartNode?: boolean) => void
}

export type QuestionNodeType = Node<QuestionNodeData, 'question'>
export type ChoiceNodeType = Node<ChoiceNodeData, 'choice'>

export type AppNodes = Node<QuestionNodeData | ChoiceNodeData>[]
