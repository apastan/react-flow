import { createBrowserRouter } from 'react-router-dom'
import { DiagramBuilder } from '@/features/telegram-bot-builder/ui'
import { ReactFlowProvider } from '@xyflow/react'
import { FormBuilder } from '@/features/tg-bot-builder-form/ui'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ReactFlowProvider>
        <DiagramBuilder />
      </ReactFlowProvider>
    ),
  },
  {
    path: '/form',
    element: <FormBuilder />,
  },
])
