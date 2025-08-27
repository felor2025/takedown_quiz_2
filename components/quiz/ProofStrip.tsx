'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProofStripProps {
  className?: string
  variant?: 'default' | 'compact'
}

// Базовое значение для SSR
const BASE_COUNT = 1247

// Мок данные для демонстрации "живых" метрик
const generateLiveCount = () => {
  const base = BASE_COUNT
  const variance = Math.floor(Math.random() * 20) - 10
  return Math.max(0, base + variance)
}

export function ProofStrip({ className, variant = 'default' }: ProofStripProps) {
  const [liveCount, setLiveCount] = useState(BASE_COUNT)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Устанавливаем флаг монтирования для предотвращения ошибок гидрации
    setIsMounted(true)
    
    // Генерируем первое случайное значение после монтирования
    setLiveCount(generateLiveCount())
    
    // Обновляем "живой" счетчик каждые 30 секунд для реалистичности
    const interval = setInterval(() => {
      setLiveCount(generateLiveCount())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Форматируем число без локализации для предотвращения ошибок гидрации
  const formatCount = (num: number) => {
    if (!isMounted) return BASE_COUNT.toString() // Возвращаем базовое значение до монтирования
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const chips = [
    `Removed today ${formatCount(liveCount)}`,
    'Median TTFD ≤24h',
    'Success 99%+ (compatible)'
  ]

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-muted', className)}>
        {chips.map((chip, index) => (
          <span key={index} className="inline-flex items-center">
            {chip}
            {index < chips.length - 1 && <span className="mx-2">•</span>}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('w-full py-8 relative', className)}>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {chips.map((chip, index) => (
            <div 
              key={index}
              className="group inline-flex items-center px-4 py-2 rounded-lg bg-card/80 border border-primary/20 text-sm text-text hover:border-primary/40 hover:bg-card/90 transition-all duration-200"
            >
              <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></div>
              {chip}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-32"></div>
          <p className="text-center text-xs text-muted/80 mx-4 whitespace-nowrap">
            Updated every 10 min • Figures vary by case
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-32"></div>
        </div>
      </div>
    </div>
  )
}
