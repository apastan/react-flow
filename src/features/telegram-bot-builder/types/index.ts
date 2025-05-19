import type { Node } from '@xyflow/react'

export type QuestionNodeData = {
  isStartNode: boolean
  questionDefault: string
  responseTextDefault: string
  onlyChoicesDefault: boolean
}

export type ChoiceNodeData = {
  choiceTextDefault: string
  responseTextDefault: string
  requestContactDefault: boolean
}

export type QuestionNodeType = Node<QuestionNodeData, 'question'>
export type ChoiceNodeType = Node<ChoiceNodeData, 'choice'>

export type AppNode = Node<QuestionNodeData | ChoiceNodeData>
export type AppNodes = AppNode[]
