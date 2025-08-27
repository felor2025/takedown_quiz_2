'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100
  const percentage = Math.round(progress)

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-primary font-bold">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-card rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
