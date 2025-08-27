'use client'

import { forwardRef } from 'react'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface RadioPillProps {
  value: string
  children: React.ReactNode
  className?: string
  id?: string
}

export const RadioPill = forwardRef<HTMLButtonElement, RadioPillProps>(
  ({ value, children, className, id, ...props }, ref) => {
    return (
      <div className="relative">
        <RadioGroupItem
          value={value}
          id={id || value}
          className="sr-only peer"
          ref={ref}
          {...props}
        />
        <label
          htmlFor={id || value}
          className={cn(
            'flex items-center justify-center w-full h-12 md:h-14 px-6 py-3',
            'text-sm md:text-base font-medium cursor-pointer',
            'border border-border rounded-full transition-all duration-150',
            'hover:border-primary/50 hover:bg-primary/5',
            'peer-checked:border-primary peer-checked:bg-primary/8 peer-checked:text-text',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2',
            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
            className
          )}
        >
          {children}
        </label>
      </div>
    )
  }
)

RadioPill.displayName = 'RadioPill'
