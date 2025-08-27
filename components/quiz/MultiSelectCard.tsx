'use client'

import { cn } from '@/lib/utils'

interface MultiSelectCardProps {
  value: string
  isSelected: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  description?: string
  className?: string
}

export function MultiSelectCard({ 
  value, 
  isSelected, 
  onClick, 
  icon, 
  title, 
  description,
  className 
}: MultiSelectCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02]',
        'flex items-center gap-4 min-h-[72px]',
        isSelected 
          ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' 
          : 'bg-card border-border hover:border-primary/40 hover:bg-card/80',
        className
      )}
    >
      <div className={cn(
        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
        isSelected 
          ? 'bg-primary text-white' 
          : 'bg-muted/20 text-muted-foreground'
      )}>
        {icon}
      </div>
      
      <div className="flex-1">
        <div className={cn(
          'font-medium text-base',
          isSelected ? 'text-text' : 'text-text'
        )}>
          {title}
        </div>
        {description && (
          <div className={cn(
            'text-sm mt-1',
            isSelected ? 'text-text/80' : 'text-muted'
          )}>
            {description}
          </div>
        )}
      </div>
      
      <div className={cn(
        'flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
        isSelected 
          ? 'bg-primary border-primary' 
          : 'border-border bg-transparent'
      )}>
        {isSelected && (
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            className="text-white"
          >
            <path 
              d="M10 3L4.5 8.5L2 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  )
}
