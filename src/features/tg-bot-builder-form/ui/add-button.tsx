import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '@/lib/utils.ts'

export type AddQuestionButtonProps = ComponentPropsWithoutRef<'button'>

export const AddButton = forwardRef<HTMLButtonElement, AddQuestionButtonProps>(
  (props, ref) => {
    const { className, ...restProps } = props

    return (
      <button
        type={'button'}
        className={cn(
          [
            'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium',
            'w-full bg-neutral-50 hover:bg-accent border border-dashed border-neutral-300 py-10 rounded-xl cursor-pointer transition-colors',
          ],
          className
        )}
        {...restProps}
        ref={ref}
      />
    )
  }
)

AddButton.displayName = 'AddButton'
