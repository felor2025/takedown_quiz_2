'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StepShellProps {
  title: string
  children: React.ReactNode
  className?: string
}

const slideVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
}

export function StepShell({ title, children, className }: StepShellProps) {
  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('w-full max-w-lg mx-auto px-4', className)}
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
          {title}
        </h1>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
}
